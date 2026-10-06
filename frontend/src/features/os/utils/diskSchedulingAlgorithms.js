/**
 * Disk Scheduling Algorithms Utility
 * Implementations for FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK.
 * Generates step-by-step state traces driving the interactive visualizer.
 */

/**
 * Parses raw input string into array of integer tracks.
 * Preserves duplicates and assigns unique IDs.
 */
export function parseRequestQueue(inputStr, minTrack = 0, maxTrack = 199) {
  if (!inputStr || typeof inputStr !== 'string') return { requests: [], error: '' };

  const tokens = inputStr.trim().split(/[\s,]+/);
  const requests = [];
  const invalidTokens = [];
  const outOfRangeTokens = [];

  tokens.forEach((tok, idx) => {
    if (tok === '') return;
    const num = parseInt(tok, 10);
    if (isNaN(num)) {
      invalidTokens.push(tok);
    } else if (num < minTrack || num > maxTrack) {
      outOfRangeTokens.push(num);
    } else {
      requests.push({ id: idx, track: num });
    }
  });

  let error = '';
  if (invalidTokens.length > 0) {
    error = `Invalid non-numeric input values: ${invalidTokens.join(', ')}`;
  } else if (outOfRangeTokens.length > 0) {
    error = `Track values out of bounds [${minTrack}, ${maxTrack}]: ${outOfRangeTokens.join(', ')}`;
  }

  return { requests, error };
}

/**
 * Helper to build standard step event object
 */
function createEvent({
  stepNum,
  eventType, // 'request' | 'boundary' | 'wraparound'
  previousHead,
  currentHead,
  requestTrack = null,
  movement,
  cumulativeMovement,
  direction,
  servicedRequests,
  pendingRequests,
  explanation
}) {
  return {
    stepNum,
    eventType,
    previousHead,
    currentHead,
    requestTrack,
    movement,
    cumulativeMovement,
    direction,
    servicedRequests: servicedRequests.map(r => ({ ...r })),
    pendingRequests: pendingRequests.map(r => ({ ...r })),
    explanation
  };
}

/**
 * 1. FCFS (First-Come, First-Served)
 */
export function simulateFCFS(requests, initialHead, diskMin = 0, diskMax = 199) {
  let head = initialHead;
  let cumulativeMovement = 0;
  const serviced = [];
  const pending = [...requests];
  const events = [];

  pending.forEach((req, idx) => {
    const dist = Math.abs(req.track - head);
    const prevHead = head;
    head = req.track;
    cumulativeMovement += dist;
    serviced.push(req);

    const remainingPending = pending.slice(idx + 1);

    events.push(createEvent({
      stepNum: idx + 1,
      eventType: 'request',
      previousHead: prevHead,
      currentHead: head,
      requestTrack: req.track,
      movement: dist,
      cumulativeMovement,
      direction: head >= prevHead ? 'up' : 'down',
      servicedRequests: serviced,
      pendingRequests: remainingPending,
      explanation: `FCFS serviced request at track ${req.track} in original arrival order. Distance: |${req.track} - ${prevHead}| = ${dist} tracks.`
    }));
  });

  const totalReqs = requests.length;
  const averageMovement = totalReqs > 0 ? (cumulativeMovement / totalReqs) : 0;

  return {
    algorithm: 'FCFS',
    initialHead,
    diskMin,
    diskMax,
    totalMovement: cumulativeMovement,
    averageMovement,
    servicedSequence: serviced.map(r => r.track),
    events
  };
}

/**
 * 2. SSTF (Shortest Seek Time First)
 */
export function simulateSSTF(requests, initialHead, diskMin = 0, diskMax = 199, initialDir = 'up') {
  let head = initialHead;
  let cumulativeMovement = 0;
  let dir = initialDir;
  const serviced = [];
  let pending = [...requests];
  const events = [];
  let step = 1;

  while (pending.length > 0) {
    // Find request with minimum distance to head
    let minDist = Infinity;
    let selectedIdx = -1;

    pending.forEach((req, idx) => {
      const dist = Math.abs(req.track - head);
      if (dist < minDist) {
        minDist = dist;
        selectedIdx = idx;
      } else if (dist === minDist && selectedIdx !== -1) {
        // Deterministic tie-breaker: prefer request in current direction, else lower track
        const currentSelectedTrack = pending[selectedIdx].track;
        const candidateTrack = req.track;
        if (dir === 'up' && candidateTrack > head && currentSelectedTrack < head) {
          selectedIdx = idx;
        } else if (dir === 'down' && candidateTrack < head && currentSelectedTrack > head) {
          selectedIdx = idx;
        } else if (candidateTrack < currentSelectedTrack) {
          selectedIdx = idx;
        }
      }
    });

    const targetReq = pending[selectedIdx];
    const prevHead = head;
    const dist = Math.abs(targetReq.track - prevHead);
    head = targetReq.track;
    cumulativeMovement += dist;

    dir = head >= prevHead ? 'up' : 'down';
    serviced.push(targetReq);
    pending = pending.filter((_, idx) => idx !== selectedIdx);

    events.push(createEvent({
      stepNum: step,
      eventType: 'request',
      previousHead: prevHead,
      currentHead: head,
      requestTrack: targetReq.track,
      movement: dist,
      cumulativeMovement,
      direction: dir,
      servicedRequests: serviced,
      pendingRequests: pending,
      explanation: `SSTF selected closest request at track ${targetReq.track} (seek distance: ${dist} tracks).`
    }));

    step++;
  }

  const totalReqs = requests.length;
  const averageMovement = totalReqs > 0 ? (cumulativeMovement / totalReqs) : 0;

  return {
    algorithm: 'SSTF',
    initialHead,
    diskMin,
    diskMax,
    totalMovement: cumulativeMovement,
    averageMovement,
    servicedSequence: serviced.map(r => r.track),
    events
  };
}

/**
 * 3. SCAN (Elevator Algorithm)
 */
export function simulateSCAN(requests, initialHead, diskMin = 0, diskMax = 199, initialDir = 'up') {
  let head = initialHead;
  let cumulativeMovement = 0;
  let dir = initialDir;
  const serviced = [];
  let pending = [...requests];
  const events = [];
  let step = 1;

  if (dir === 'up') {
    // Service higher requests in ascending order
    const higherReqs = pending.filter(r => r.track >= head).sort((a, b) => a.track - b.track);
    const lowerReqs = pending.filter(r => r.track < head).sort((a, b) => b.track - a.track);

    higherReqs.forEach(req => {
      const prevHead = head;
      const dist = Math.abs(req.track - prevHead);
      head = req.track;
      cumulativeMovement += dist;
      serviced.push(req);
      pending = pending.filter(r => r.id !== req.id);

      events.push(createEvent({
        stepNum: step++,
        eventType: 'request',
        previousHead: prevHead,
        currentHead: head,
        requestTrack: req.track,
        movement: dist,
        cumulativeMovement,
        direction: 'up',
        servicedRequests: serviced,
        pendingRequests: pending,
        explanation: `SCAN (Up) serviced request at track ${req.track}. Seek distance: ${dist} tracks.`
      }));
    });

    // If there are still lower requests remaining, travel to boundary diskMax
    if (lowerReqs.length > 0) {
      if (head < diskMax) {
        const prevHead = head;
        const dist = Math.abs(diskMax - prevHead);
        head = diskMax;
        cumulativeMovement += dist;

        // Check if any request sits directly at diskMax boundary
        const boundaryReqs = pending.filter(r => r.track === diskMax);
        boundaryReqs.forEach(bReq => {
          serviced.push(bReq);
          pending = pending.filter(r => r.id !== bReq.id);
        });

        events.push(createEvent({
          stepNum: step++,
          eventType: 'boundary',
          previousHead: prevHead,
          currentHead: head,
          requestTrack: boundaryReqs.length > 0 ? diskMax : null,
          movement: dist,
          cumulativeMovement,
          direction: 'up',
          servicedRequests: serviced,
          pendingRequests: pending,
          explanation: `SCAN reached upper disk boundary track ${diskMax}. Reversing direction to Downward.`
        }));
      }

      // Reverse direction and service remaining lower requests descending
      dir = 'down';
      lowerReqs.forEach(req => {
        const prevHead = head;
        const dist = Math.abs(req.track - prevHead);
        head = req.track;
        cumulativeMovement += dist;
        serviced.push(req);
        pending = pending.filter(r => r.id !== req.id);

        events.push(createEvent({
          stepNum: step++,
          eventType: 'request',
          previousHead: prevHead,
          currentHead: head,
          requestTrack: req.track,
          movement: dist,
          cumulativeMovement,
          direction: 'down',
          servicedRequests: serviced,
          pendingRequests: pending,
          explanation: `SCAN (Down) serviced request at track ${req.track}. Seek distance: ${dist} tracks.`
        }));
      });
    }
  } else {
    // Initial direction 'down'
    const lowerReqs = pending.filter(r => r.track <= head).sort((a, b) => b.track - a.track);
    const higherReqs = pending.filter(r => r.track > head).sort((a, b) => a.track - b.track);

    lowerReqs.forEach(req => {
      const prevHead = head;
      const dist = Math.abs(req.track - prevHead);
      head = req.track;
      cumulativeMovement += dist;
      serviced.push(req);
      pending = pending.filter(r => r.id !== req.id);

      events.push(createEvent({
        stepNum: step++,
        eventType: 'request',
        previousHead: prevHead,
        currentHead: head,
        requestTrack: req.track,
        movement: dist,
        cumulativeMovement,
        direction: 'down',
        servicedRequests: serviced,
        pendingRequests: pending,
        explanation: `SCAN (Down) serviced request at track ${req.track}. Seek distance: ${dist} tracks.`
      }));
    });

    if (higherReqs.length > 0) {
      if (head > diskMin) {
        const prevHead = head;
        const dist = Math.abs(prevHead - diskMin);
        head = diskMin;
        cumulativeMovement += dist;

        const boundaryReqs = pending.filter(r => r.track === diskMin);
        boundaryReqs.forEach(bReq => {
          serviced.push(bReq);
          pending = pending.filter(r => r.id !== bReq.id);
        });

        events.push(createEvent({
          stepNum: step++,
          eventType: 'boundary',
          previousHead: prevHead,
          currentHead: head,
          requestTrack: boundaryReqs.length > 0 ? diskMin : null,
          movement: dist,
          cumulativeMovement,
          direction: 'down',
          servicedRequests: serviced,
          pendingRequests: pending,
          explanation: `SCAN reached lower disk boundary track ${diskMin}. Reversing direction to Upward.`
        }));
      }

      dir = 'up';
      higherReqs.forEach(req => {
        const prevHead = head;
        const dist = Math.abs(req.track - prevHead);
        head = req.track;
        cumulativeMovement += dist;
        serviced.push(req);
        pending = pending.filter(r => r.id !== req.id);

        events.push(createEvent({
          stepNum: step++,
          eventType: 'request',
          previousHead: prevHead,
          currentHead: head,
          requestTrack: req.track,
          movement: dist,
          cumulativeMovement,
          direction: 'up',
          servicedRequests: serviced,
          pendingRequests: pending,
          explanation: `SCAN (Up) serviced request at track ${req.track}. Seek distance: ${dist} tracks.`
        }));
      });
    }
  }

  const totalReqs = requests.length;
  const averageMovement = totalReqs > 0 ? (cumulativeMovement / totalReqs) : 0;

  return {
    algorithm: 'SCAN',
    initialHead,
    diskMin,
    diskMax,
    totalMovement: cumulativeMovement,
    averageMovement,
    servicedSequence: serviced.map(r => r.track),
    events
  };
}

/**
 * 4. C-SCAN (Circular SCAN)
 */
export function simulateCSCAN(requests, initialHead, diskMin = 0, diskMax = 199, initialDir = 'up') {
  let head = initialHead;
  let cumulativeMovement = 0;
  const serviced = [];
  let pending = [...requests];
  const events = [];
  let step = 1;

  if (initialDir === 'up') {
    const higherReqs = pending.filter(r => r.track >= head).sort((a, b) => a.track - b.track);
    const lowerReqs = pending.filter(r => r.track < head).sort((a, b) => a.track - b.track);

    higherReqs.forEach(req => {
      const prevHead = head;
      const dist = Math.abs(req.track - prevHead);
      head = req.track;
      cumulativeMovement += dist;
      serviced.push(req);
      pending = pending.filter(r => r.id !== req.id);

      events.push(createEvent({
        stepNum: step++,
        eventType: 'request',
        previousHead: prevHead,
        currentHead: head,
        requestTrack: req.track,
        movement: dist,
        cumulativeMovement,
        direction: 'up',
        servicedRequests: serviced,
        pendingRequests: pending,
        explanation: `C-SCAN (Up) serviced request at track ${req.track}. Seek distance: ${dist} tracks.`
      }));
    });

    if (lowerReqs.length > 0) {
      // Step to diskMax boundary
      if (head < diskMax) {
        const prevHead = head;
        const dist = Math.abs(diskMax - prevHead);
        head = diskMax;
        cumulativeMovement += dist;

        const boundaryReqs = pending.filter(r => r.track === diskMax);
        boundaryReqs.forEach(bReq => {
          serviced.push(bReq);
          pending = pending.filter(r => r.id !== bReq.id);
        });

        events.push(createEvent({
          stepNum: step++,
          eventType: 'boundary',
          previousHead: prevHead,
          currentHead: head,
          requestTrack: boundaryReqs.length > 0 ? diskMax : null,
          movement: dist,
          cumulativeMovement,
          direction: 'up',
          servicedRequests: serviced,
          pendingRequests: pending,
          explanation: `C-SCAN reached max disk boundary track ${diskMax}.`
        }));
      }

      // Perform circular jump to min boundary diskMin
      const prevHead = head;
      const jumpDist = Math.abs(diskMax - diskMin);
      head = diskMin;
      cumulativeMovement += jumpDist;

      const minBoundaryReqs = pending.filter(r => r.track === diskMin);
      minBoundaryReqs.forEach(bReq => {
        serviced.push(bReq);
        pending = pending.filter(r => r.id !== bReq.id);
      });

      events.push(createEvent({
        stepNum: step++,
        eventType: 'wraparound',
        previousHead: prevHead,
        currentHead: head,
        requestTrack: minBoundaryReqs.length > 0 ? diskMin : null,
        movement: jumpDist,
        cumulativeMovement,
        direction: 'up',
        servicedRequests: serviced,
        pendingRequests: pending,
        explanation: `C-SCAN circular wraparound from track ${prevHead} to track ${diskMin}. Jump distance: ${jumpDist} tracks.`
      }));

      // Service lower requests in ascending order
      lowerReqs.forEach(req => {
        if (serviced.some(s => s.id === req.id)) return;
        const prevHeadInner = head;
        const dist = Math.abs(req.track - prevHeadInner);
        head = req.track;
        cumulativeMovement += dist;
        serviced.push(req);
        pending = pending.filter(r => r.id !== req.id);

        events.push(createEvent({
          stepNum: step++,
          eventType: 'request',
          previousHead: prevHeadInner,
          currentHead: head,
          requestTrack: req.track,
          movement: dist,
          cumulativeMovement,
          direction: 'up',
          servicedRequests: serviced,
          pendingRequests: pending,
          explanation: `C-SCAN (Up) serviced request at track ${req.track}. Seek distance: ${dist} tracks.`
        }));
      });
    }
  } else {
    // Initial direction 'down'
    const lowerReqs = pending.filter(r => r.track <= head).sort((a, b) => b.track - a.track);
    const higherReqs = pending.filter(r => r.track > head).sort((a, b) => b.track - a.track);

    lowerReqs.forEach(req => {
      const prevHead = head;
      const dist = Math.abs(req.track - prevHead);
      head = req.track;
      cumulativeMovement += dist;
      serviced.push(req);
      pending = pending.filter(r => r.id !== req.id);

      events.push(createEvent({
        stepNum: step++,
        eventType: 'request',
        previousHead: prevHead,
        currentHead: head,
        requestTrack: req.track,
        movement: dist,
        cumulativeMovement,
        direction: 'down',
        servicedRequests: serviced,
        pendingRequests: pending,
        explanation: `C-SCAN (Down) serviced request at track ${req.track}. Seek distance: ${dist} tracks.`
      }));
    });

    if (higherReqs.length > 0) {
      if (head > diskMin) {
        const prevHead = head;
        const dist = Math.abs(prevHead - diskMin);
        head = diskMin;
        cumulativeMovement += dist;

        const boundaryReqs = pending.filter(r => r.track === diskMin);
        boundaryReqs.forEach(bReq => {
          serviced.push(bReq);
          pending = pending.filter(r => r.id !== bReq.id);
        });

        events.push(createEvent({
          stepNum: step++,
          eventType: 'boundary',
          previousHead: prevHead,
          currentHead: head,
          requestTrack: boundaryReqs.length > 0 ? diskMin : null,
          movement: dist,
          cumulativeMovement,
          direction: 'down',
          servicedRequests: serviced,
          pendingRequests: pending,
          explanation: `C-SCAN reached min disk boundary track ${diskMin}.`
        }));
      }

      const prevHead = head;
      const jumpDist = Math.abs(diskMax - diskMin);
      head = diskMax;
      cumulativeMovement += jumpDist;

      const maxBoundaryReqs = pending.filter(r => r.track === diskMax);
      maxBoundaryReqs.forEach(bReq => {
        serviced.push(bReq);
        pending = pending.filter(r => r.id !== bReq.id);
      });

      events.push(createEvent({
        stepNum: step++,
        eventType: 'wraparound',
        previousHead: prevHead,
        currentHead: head,
        requestTrack: maxBoundaryReqs.length > 0 ? diskMax : null,
        movement: jumpDist,
        cumulativeMovement,
        direction: 'down',
        servicedRequests: serviced,
        pendingRequests: pending,
        explanation: `C-SCAN circular wraparound from track ${prevHead} to track ${diskMax}. Jump distance: ${jumpDist} tracks.`
      }));

      higherReqs.forEach(req => {
        if (serviced.some(s => s.id === req.id)) return;
        const prevHeadInner = head;
        const dist = Math.abs(req.track - prevHeadInner);
        head = req.track;
        cumulativeMovement += dist;
        serviced.push(req);
        pending = pending.filter(r => r.id !== req.id);

        events.push(createEvent({
          stepNum: step++,
          eventType: 'request',
          previousHead: prevHeadInner,
          currentHead: head,
          requestTrack: req.track,
          movement: dist,
          cumulativeMovement,
          direction: 'down',
          servicedRequests: serviced,
          pendingRequests: pending,
          explanation: `C-SCAN (Down) serviced request at track ${req.track}. Seek distance: ${dist} tracks.`
        }));
      });
    }
  }

  const totalReqs = requests.length;
  const averageMovement = totalReqs > 0 ? (cumulativeMovement / totalReqs) : 0;

  return {
    algorithm: 'C-SCAN',
    initialHead,
    diskMin,
    diskMax,
    totalMovement: cumulativeMovement,
    averageMovement,
    servicedSequence: serviced.map(r => r.track),
    events
  };
}

/**
 * 5. LOOK
 */
export function simulateLOOK(requests, initialHead, diskMin = 0, diskMax = 199, initialDir = 'up') {
  let head = initialHead;
  let cumulativeMovement = 0;
  let dir = initialDir;
  const serviced = [];
  let pending = [...requests];
  const events = [];
  let step = 1;

  if (dir === 'up') {
    const higherReqs = pending.filter(r => r.track >= head).sort((a, b) => a.track - b.track);
    const lowerReqs = pending.filter(r => r.track < head).sort((a, b) => b.track - a.track);

    higherReqs.forEach(req => {
      const prevHead = head;
      const dist = Math.abs(req.track - prevHead);
      head = req.track;
      cumulativeMovement += dist;
      serviced.push(req);
      pending = pending.filter(r => r.id !== req.id);

      events.push(createEvent({
        stepNum: step++,
        eventType: 'request',
        previousHead: prevHead,
        currentHead: head,
        requestTrack: req.track,
        movement: dist,
        cumulativeMovement,
        direction: 'up',
        servicedRequests: serviced,
        pendingRequests: pending,
        explanation: `LOOK (Up) serviced request at track ${req.track}. Seek distance: ${dist} tracks.`
      }));
    });

    if (lowerReqs.length > 0) {
      dir = 'down';
      lowerReqs.forEach(req => {
        const prevHead = head;
        const dist = Math.abs(req.track - prevHead);
        head = req.track;
        cumulativeMovement += dist;
        serviced.push(req);
        pending = pending.filter(r => r.id !== req.id);

        events.push(createEvent({
          stepNum: step++,
          eventType: 'request',
          previousHead: prevHead,
          currentHead: head,
          requestTrack: req.track,
          movement: dist,
          cumulativeMovement,
          direction: 'down',
          servicedRequests: serviced,
          pendingRequests: pending,
          explanation: `LOOK reversed at track ${prevHead} to Downward. Serviced request at track ${req.track}. Seek distance: ${dist} tracks.`
        }));
      });
    }
  } else {
    // Initial direction 'down'
    const lowerReqs = pending.filter(r => r.track <= head).sort((a, b) => b.track - a.track);
    const higherReqs = pending.filter(r => r.track > head).sort((a, b) => a.track - b.track);

    lowerReqs.forEach(req => {
      const prevHead = head;
      const dist = Math.abs(req.track - prevHead);
      head = req.track;
      cumulativeMovement += dist;
      serviced.push(req);
      pending = pending.filter(r => r.id !== req.id);

      events.push(createEvent({
        stepNum: step++,
        eventType: 'request',
        previousHead: prevHead,
        currentHead: head,
        requestTrack: req.track,
        movement: dist,
        cumulativeMovement,
        direction: 'down',
        servicedRequests: serviced,
        pendingRequests: pending,
        explanation: `LOOK (Down) serviced request at track ${req.track}. Seek distance: ${dist} tracks.`
      }));
    });

    if (higherReqs.length > 0) {
      dir = 'up';
      higherReqs.forEach(req => {
        const prevHead = head;
        const dist = Math.abs(req.track - prevHead);
        head = req.track;
        cumulativeMovement += dist;
        serviced.push(req);
        pending = pending.filter(r => r.id !== req.id);

        events.push(createEvent({
          stepNum: step++,
          eventType: 'request',
          previousHead: prevHead,
          currentHead: head,
          requestTrack: req.track,
          movement: dist,
          cumulativeMovement,
          direction: 'up',
          servicedRequests: serviced,
          pendingRequests: pending,
          explanation: `LOOK reversed at track ${prevHead} to Upward. Serviced request at track ${req.track}. Seek distance: ${dist} tracks.`
        }));
      });
    }
  }

  const totalReqs = requests.length;
  const averageMovement = totalReqs > 0 ? (cumulativeMovement / totalReqs) : 0;

  return {
    algorithm: 'LOOK',
    initialHead,
    diskMin,
    diskMax,
    totalMovement: cumulativeMovement,
    averageMovement,
    servicedSequence: serviced.map(r => r.track),
    events
  };
}

/**
 * 6. C-LOOK (Circular LOOK)
 */
export function simulateCLOOK(requests, initialHead, diskMin = 0, diskMax = 199, initialDir = 'up') {
  let head = initialHead;
  let cumulativeMovement = 0;
  const serviced = [];
  let pending = [...requests];
  const events = [];
  let step = 1;

  if (initialDir === 'up') {
    const higherReqs = pending.filter(r => r.track >= head).sort((a, b) => a.track - b.track);
    const lowerReqs = pending.filter(r => r.track < head).sort((a, b) => a.track - b.track);

    higherReqs.forEach(req => {
      const prevHead = head;
      const dist = Math.abs(req.track - prevHead);
      head = req.track;
      cumulativeMovement += dist;
      serviced.push(req);
      pending = pending.filter(r => r.id !== req.id);

      events.push(createEvent({
        stepNum: step++,
        eventType: 'request',
        previousHead: prevHead,
        currentHead: head,
        requestTrack: req.track,
        movement: dist,
        cumulativeMovement,
        direction: 'up',
        servicedRequests: serviced,
        pendingRequests: pending,
        explanation: `C-LOOK (Up) serviced request at track ${req.track}. Seek distance: ${dist} tracks.`
      }));
    });

    if (lowerReqs.length > 0) {
      // Circular jump from highest pending request to lowest remaining request
      const lowestReq = lowerReqs[0];
      const prevHead = head;
      const jumpDist = Math.abs(lowestReq.track - prevHead);
      head = lowestReq.track;
      cumulativeMovement += jumpDist;

      serviced.push(lowestReq);
      pending = pending.filter(r => r.id !== lowestReq.id);

      events.push(createEvent({
        stepNum: step++,
        eventType: 'wraparound',
        previousHead: prevHead,
        currentHead: head,
        requestTrack: lowestReq.track,
        movement: jumpDist,
        cumulativeMovement,
        direction: 'up',
        servicedRequests: serviced,
        pendingRequests: pending,
        explanation: `C-LOOK circular jump from track ${prevHead} to lowest request at track ${lowestReq.track}. Jump distance: ${jumpDist} tracks.`
      }));

      // Service remaining lower requests in ascending order
      lowerReqs.slice(1).forEach(req => {
        const prevHeadInner = head;
        const dist = Math.abs(req.track - prevHeadInner);
        head = req.track;
        cumulativeMovement += dist;
        serviced.push(req);
        pending = pending.filter(r => r.id !== req.id);

        events.push(createEvent({
          stepNum: step++,
          eventType: 'request',
          previousHead: prevHeadInner,
          currentHead: head,
          requestTrack: req.track,
          movement: dist,
          cumulativeMovement,
          direction: 'up',
          servicedRequests: serviced,
          pendingRequests: pending,
          explanation: `C-LOOK (Up) serviced request at track ${req.track}. Seek distance: ${dist} tracks.`
        }));
      });
    }
  } else {
    // Initial direction 'down'
    const lowerReqs = pending.filter(r => r.track <= head).sort((a, b) => b.track - a.track);
    const higherReqs = pending.filter(r => r.track > head).sort((a, b) => b.track - a.track);

    lowerReqs.forEach(req => {
      const prevHead = head;
      const dist = Math.abs(req.track - prevHead);
      head = req.track;
      cumulativeMovement += dist;
      serviced.push(req);
      pending = pending.filter(r => r.id !== req.id);

      events.push(createEvent({
        stepNum: step++,
        eventType: 'request',
        previousHead: prevHead,
        currentHead: head,
        requestTrack: req.track,
        movement: dist,
        cumulativeMovement,
        direction: 'down',
        servicedRequests: serviced,
        pendingRequests: pending,
        explanation: `C-LOOK (Down) serviced request at track ${req.track}. Seek distance: ${dist} tracks.`
      }));
    });

    if (higherReqs.length > 0) {
      const highestReq = higherReqs[0];
      const prevHead = head;
      const jumpDist = Math.abs(highestReq.track - prevHead);
      head = highestReq.track;
      cumulativeMovement += jumpDist;

      serviced.push(highestReq);
      pending = pending.filter(r => r.id !== highestReq.id);

      events.push(createEvent({
        stepNum: step++,
        eventType: 'wraparound',
        previousHead: prevHead,
        currentHead: head,
        requestTrack: highestReq.track,
        movement: jumpDist,
        cumulativeMovement,
        direction: 'down',
        servicedRequests: serviced,
        pendingRequests: pending,
        explanation: `C-LOOK circular jump from track ${prevHead} to highest request at track ${highestReq.track}. Jump distance: ${jumpDist} tracks.`
      }));

      higherReqs.slice(1).forEach(req => {
        const prevHeadInner = head;
        const dist = Math.abs(req.track - prevHeadInner);
        head = req.track;
        cumulativeMovement += dist;
        serviced.push(req);
        pending = pending.filter(r => r.id !== req.id);

        events.push(createEvent({
          stepNum: step++,
          eventType: 'request',
          previousHead: prevHeadInner,
          currentHead: head,
          requestTrack: req.track,
          movement: dist,
          cumulativeMovement,
          direction: 'down',
          servicedRequests: serviced,
          pendingRequests: pending,
          explanation: `C-LOOK (Down) serviced request at track ${req.track}. Seek distance: ${dist} tracks.`
        }));
      });
    }
  }

  const totalReqs = requests.length;
  const averageMovement = totalReqs > 0 ? (cumulativeMovement / totalReqs) : 0;

  return {
    algorithm: 'C-LOOK',
    initialHead,
    diskMin,
    diskMax,
    totalMovement: cumulativeMovement,
    averageMovement,
    servicedSequence: serviced.map(r => r.track),
    events
  };
}

/**
 * Runner function to execute algorithm by name
 */
export function runDiskSimulation(algoName, requests, initialHead, diskMin = 0, diskMax = 199, direction = 'up') {
  switch (algoName.toUpperCase()) {
    case 'FCFS':
      return simulateFCFS(requests, initialHead, diskMin, diskMax);
    case 'SSTF':
      return simulateSSTF(requests, initialHead, diskMin, diskMax, direction);
    case 'SCAN':
      return simulateSCAN(requests, initialHead, diskMin, diskMax, direction);
    case 'C-SCAN':
    case 'CSCAN':
      return simulateCSCAN(requests, initialHead, diskMin, diskMax, direction);
    case 'LOOK':
      return simulateLOOK(requests, initialHead, diskMin, diskMax, direction);
    case 'C-LOOK':
    case 'CLOOK':
      return simulateCLOOK(requests, initialHead, diskMin, diskMax, direction);
    default:
      return simulateFCFS(requests, initialHead, diskMin, diskMax);
  }
}
