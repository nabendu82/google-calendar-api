const { google } = require('googleapis');
require('dotenv').config();

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

const TIMEOFFSET = '+05:30';

const dateTimeForCalander = () => {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }

    const newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;
    const event = new Date(Date.parse(newDateTime));

    const startDate = event;
    const endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));

    return {
        'start': startDate,
        'end': endDate
    }
};

// Insert new event to Google Calendar
const insertEvent = async (event) => {
    try {
        const response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });
    
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return "Event Inserted sucessfully";
        } else {
            return "Failed to insert event";
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
};

let dateTime = dateTimeForCalander();
// Event for Google Calendar
let event = {
    'summary': `This is the summary.`,
    'description': `This is the description.`,
    'start': {
        'dateTime': dateTime['start'],
        'timeZone': 'Asia/Kolkata'
    },
    'end': {
        'dateTime': dateTime['end'],
        'timeZone': 'Asia/Kolkata'
    }
};

const insertNewEvent = async (event) => {
    try {
        const res = await insertEvent(event);
        console.log(res)
    } catch (error) {
        console.log(error);
    }
}

// insertNewEvent(event);

// Get all the events between two dates
const getEvents = async (dateTimeStart, dateTimeEnd) => {

    try {
        const response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            timeMin: dateTimeStart,
            timeMax: dateTimeEnd,
            timeZone: 'Asia/Kolkata'
        });
    
        const items = response['data']['items'];
        return items;
    } catch (error) {
        console.log(`Error at getEvents --> ${error}`);
        return 0;
    }
};

const start = '2022-01-01T00:00:00.000Z';
const end = '2022-06-25T00:00:00.000Z';

const getAllEvents = async (start, end) => {
    try {
        const res = await getEvents(start, end);
        console.log(res)
    } catch (error) {
        console.log(error);
    }
}

// getAllEvents(start, end)

// Delete an event from eventID
const deleteEvent = async (eventId) => {

    try {
        const response = await calendar.events.delete({
            auth: auth,
            calendarId: calendarId,
            eventId: eventId
        });

        if (response.data === '') {
            return "Event deleted successfully";
        } else {
            return "Error in deleting event";
        }
    } catch (error) {
        console.log(`Error at deleteEvent --> ${error}`);
        return 0;
    }
};

const eventId = 'm53qlealk706706qoh8c812974';

const deleteSingleEvent = async (eventId) => {
    try {
        const res = await deleteEvent(eventId);
        console.log(res)
    } catch (error) {
        console.log(error);
    }
}

deleteSingleEvent(eventId)
