
import bizSdk from 'facebook-nodejs-business-sdk';

import { FACEBOOK_ACCESS_TOKEN, FACEBOOK_PIXEL_ID } from '$env/static/private'; 

const fbEvent = (event: string, emails: Array<string>, amountSpent = 0) => {



const ServerEvent = bizSdk.ServerEvent;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const CustomData = bizSdk.CustomData;
const Content = bizSdk.Content;

const access_token = FACEBOOK_ACCESS_TOKEN;
const pixel_id = FACEBOOK_PIXEL_ID;
const api = bizSdk.FacebookAdsApi.init(access_token);

let current_timestamp = Math.floor(new Date() / 1000);

const userData_0 = (new UserData())
    .setEmails(emails)
    .setPhones([]);
const customData_0 = (new CustomData())
    .setValue(amountSpent)
    .setCurrency("USD");
const serverEvent_0 = (new ServerEvent())
    .setEventName(event)
    .setEventTime(current_timestamp)
    .setUserData(userData_0)
    .setCustomData(customData_0)
    .setActionSource("website");

const eventsData = [serverEvent_0];
const eventRequest = (new EventRequest(access_token, pixel_id))
    .setEvents(eventsData);
eventRequest.execute();

}

export default fbEvent;