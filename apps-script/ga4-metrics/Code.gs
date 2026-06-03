/**
 * NikoLearn — GA4 key-metrics proxy (read-only, aggregate counts only, NO PII).
 * Deployed as a Web App that executes as the deploying user (shonia.g@gmail.com),
 * so it uses that user's own GA4 read access. No service account, no billing.
 *
 * Returns JSON:
 *  { ok, usersToday, users7, views7, signupsToday, signups7, updated }
 *
 * Only aggregate numbers leave this endpoint. Never names, phones, or any PII.
 */
var GA4_PROPERTY = '539978869'; // NikoLearn GA4 property

function doGet() {
  try {
    var token = ScriptApp.getOAuthToken();
    var url = 'https://analyticsdata.googleapis.com/v1beta/properties/' + GA4_PROPERTY + ':runReport';

    // Report 1: users + page views, today + last 7 days
    var traffic = runReport_(url, token, {
      dateRanges: [
        { startDate: 'today', endDate: 'today' },     // [0] today
        { startDate: '7daysAgo', endDate: 'today' }    // [1] last 7d
      ],
      metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }]
    });

    // Report 2: sign_up event count, today + last 7 days
    var signups = runReport_(url, token, {
      dateRanges: [
        { startDate: 'today', endDate: 'today' },
        { startDate: '7daysAgo', endDate: 'today' }
      ],
      metrics: [{ name: 'eventCount' }],
      dimensions: [{ name: 'dateRange' }],
      dimensionFilter: {
        filter: { fieldName: 'eventName', stringFilter: { value: 'sign_up' } }
      }
    });

    var out = {
      ok: true,
      usersToday: metric_(traffic, 0, 0),
      users7: metric_(traffic, 1, 0),
      views7: metric_(traffic, 1, 1),
      signupsToday: signupByRange_(signups, 'date_range_0'),
      signups7: sumSignups_(signups),
      updated: new Date().toISOString()
    };
    return json_(out);
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function runReport_(url, token, body) {
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify(body),
    muteHttpExceptions: true
  });
  return JSON.parse(res.getContentText() || '{}');
}

// traffic report has one row per dateRange (rows[].dimensionValues absent; values via metricValues per row)
function metric_(rep, rangeIdx, metricIdx) {
  if (!rep.rows || !rep.rows[rangeIdx]) return 0;
  var mv = rep.rows[rangeIdx].metricValues;
  return mv && mv[metricIdx] ? Number(mv[metricIdx].value) || 0 : 0;
}

function signupByRange_(rep, rangeKey) {
  if (!rep.rows) return 0;
  for (var i = 0; i < rep.rows.length; i++) {
    var dv = rep.rows[i].dimensionValues;
    if (dv && dv[0] && dv[0].value === rangeKey) {
      return Number(rep.rows[i].metricValues[0].value) || 0;
    }
  }
  return 0;
}

function sumSignups_(rep) {
  if (!rep.rows) return 0;
  var t = 0;
  for (var i = 0; i < rep.rows.length; i++) {
    if (rep.rows[i].dimensionValues[0].value === 'date_range_1') {
      t += Number(rep.rows[i].metricValues[0].value) || 0;
    }
  }
  return t;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
