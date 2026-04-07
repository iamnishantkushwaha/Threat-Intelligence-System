export function matchesQuery(values, query) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return values
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalized));
}

export function matchesDate(timestamp, selectedDate) {
  if (!selectedDate) {
    return true;
  }

  return String(timestamp || "").startsWith(selectedDate);
}

export function getSeverityCounts(alerts = []) {
  return alerts.reduce(
    (accumulator, alert) => {
      const severity = alert.severity || "Low";
      accumulator[severity] = (accumulator[severity] || 0) + 1;
      return accumulator;
    },
    { High: 0, Medium: 0, Low: 0 },
  );
}

export function getTrendData(logs = []) {
  const counts = new Map();

  logs.forEach((log) => {
    const timestamp = String(log.timestamp || "");
    const label = timestamp.slice(11, 16) || timestamp.slice(0, 10) || "Now";
    const isAlert =
      log.status === "failed" ||
      log.event_type === "login_attempt" ||
      !["192.168.1.10", "10.0.0.5"].includes(log.ip);

    if (!counts.has(label)) {
      counts.set(label, 0);
    }

    if (isAlert) {
      counts.set(label, counts.get(label) + 1);
    }
  });

  return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
}

export function getTopIps(logs = [], limit = 5) {
  const counts = logs.reduce((accumulator, log) => {
    if (!log.ip) {
      return accumulator;
    }

    accumulator[log.ip] = (accumulator[log.ip] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .map(([ip, value]) => ({ ip, value }))
    .sort((left, right) => right.value - left.value)
    .slice(0, limit);
}

export function getEventTypeDistribution(logs = []) {
  const counts = logs.reduce((accumulator, log) => {
    const eventType = log.event_type || "unknown";
    accumulator[eventType] = (accumulator[eventType] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function buildAiSummary(alerts = []) {
  const highThreat = alerts.find((alert) => alert.severity === "High");

  if (highThreat) {
    return `Multiple failed login attempts detected from IP ${highThreat.ip}. Possible brute-force attack. Immediate action recommended.`;
  }

  const mediumThreat = alerts.find((alert) => alert.severity === "Medium");

  if (mediumThreat) {
    return `${mediumThreat.type} detected from IP ${mediumThreat.ip}. Review activity and validate whether it is expected.`;
  }

  return "No high-risk pattern detected right now. Continue monitoring alerts, logs, and severity trends for unusual activity.";
}

export function getLogStatusBadge(status) {
  return status === "success" ? "success" : "failed";
}
