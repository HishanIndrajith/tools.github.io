/* exported gapiLoaded */
/* exported gisLoaded */
/* exported requestAccessToken */
/* exported handleSignoutClick */

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('signout_button').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    clientId: '323135699484-7uc73qptqbmkg59hisuqfr0gdd7gffao.apps.googleusercontent.com',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    cookiePolicy: 'single_host_origin'
  });
  gapiInited = true;
  maybeEnableButtons();
}


/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: '323135699484-7uc73qptqbmkg59hisuqfr0gdd7gffao.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gisInited) {
    requestAccessToken();
  }
}

/**
 *  Sign in the user upon button click.
 */
function requestAccessToken() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    setAccessTokenInCookie(gapi.client.getToken());
    await getApiData();
  };

  var tokenFromCookie = getAccessTokenFromCookie();
  if (tokenFromCookie != null && tokenFromCookie != "" && tokenFromCookie !== undefined){
    gapi.client.setToken(tokenFromCookie);
    getApiData();
  } else {
    tokenClient.requestAccessToken({ prompt: '' });
  }
}

async function getApiData(){
  let userInfoResponse = await getUserInfo();
  const user = userInfoResponse.result;
  const userName = user.names && user.names[0].displayName;
  const userEmail = user.emailAddresses && user.emailAddresses[0].value;

  let holidayEventsResponse = await listCalandarEvents('SL Public Holiday');
  let leaveEventsResponse = await listCalandarEvents(getFirstName(userName));




  const events = holidayEventsResponse.result.items;
  // Flatten to string to display
  const output = events.reduce(
    (str, event) => `${str}${event.summary} (${event.start.date} - ${event.end.date})\n`,
    'Events:\n');
  document.getElementById('content').innerText = output;

  const events2 = leaveEventsResponse.result.items;
  // Flatten to string to display
  const output2 = events2.reduce(
    (str, event) => `${str}${event.summary} (${event.start.date} - ${event.end.date})\n`,
    'Events:\n');
  document.getElementById('content2').innerText = output2;

}



async function getUserInfo(){
  try {
    const request = {
      'resourceName': 'people/me', // 'me' refers to the authenticated user.
      'personFields': 'names,emailAddresses',
    };
    return await gapi.client.people.people.get(request);
  } catch (err) {
    console.log(err.message);
    return;
  }
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
 async function listCalandarEvents(query) {
  const year = new Date().getFullYear();
  const timeMin = (new Date(year, 0, 1, 0, 0, 0, 0)).toISOString();
  const timeMax = (new Date(year+1, 0, 1, 0, 0, 0, 0)).toISOString();
  const calendarId = 'enactor.co.uk_rlpaq3un8kkbmce76745cagm0o@group.calendar.google.com'; 

  try {
    const request = {
      'calendarId': calendarId,
      'timeMin': timeMin,
      'timeMax': timeMax,
      'q': query,
      'maxResults': 100
    };
    return await gapi.client.calendar.events.list(request);
  } catch (err) {
    console.log(err.message);
    return;
  }
}

function getFirstName(fullName) {
  const parts = fullName.split(' '); // Split the full name by spaces
  if (parts.length > 0) {
    return parts[0]; // The first part is the first name
  } else {
    return fullName; // If there is no space, consider the whole name as the first name
  }
}


function setAccessTokenInCookie(token) {
  // session cookie expires in 3 hours
  const d = new Date();
  d.setTime(d.getTime() + (3 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = "lct=" + JSON.stringify(token) + ";" + expires + ";path=/; secure; samesite=Strict;";
}

function getAccessTokenFromCookie() {
  let name = "lct=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      let token = c.substring(name.length, c.length);
      return JSON.parse(token);
    }
  }
  return "";
}



/**
 *  Sign out the user upon button click.
 */
 function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.visibility = 'hidden';
  }
}