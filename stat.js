/*
 * Copyright (c) 2017
 * Qblinks Incorporated ("Qblinks").
 * All rights reserved.
 *
 * The information contained herein is confidential and proprietary to
 * Qblinks. Use of this information by anyone other than authorized employees
 * of Qblinks is granted only under a written non-disclosure agreement,
 * expressly prescribing the scope and manner of such use.
 */

'use strict';

const request = require('request');

/**
 * get the stat of things
 *
 * @param {object} option the xim option
 * @param {function} get_state_cb callback of this function
 */
function get_state(option, get_state_callback) {
  const get_state_options = {
    method: 'GET',
    url: `${option.xim_content.uri}/switchStat/${option.device_id}`,
    headers: {
      authorization: `Bearer ${option.xim_content.access_token}`,
    },
  };
  request(get_state_options, (error, response, body) => {
    const contact = JSON.parse(body);
    get_state_callback(contact);
  });
}
 /**
  * Get the stat
  *
  * @param {object} options object created from xim_instance() with the additional
  *                 options added by xim_authenticate, refer to corresponding
  *                 documents for the details
  * @param {function} callback to be used by the XIM driver
  */
function stat(options, callback) {
  const callback_option = JSON.parse(JSON.stringify(options));
  callback_option.result = {};
   // check xim content
  if (typeof options.xim_content === 'undefined' || typeof options.xim_content.access_token === 'undefined') {
    callback_option.result.err_no = 2;
    callback_option.result.err_msg = 'access_token is undefined';
    callback(callback_option);
  }
  if (typeof options.xim_content.uri === 'undefined') {
    callback_option.result.err_no = 3;
    callback_option.result.err_msg = 'uri is undefined';
    callback(callback_option);
  }
  if (typeof options.device_id === 'undefined') {
    callback_option.result.err_no = 4;
    callback_option.result.err_msg = 'device_id is undefined';
    callback(callback_option);
  }
  callback_option.list = [];
  get_state(options, (result) => {
    const light = {};
    light.light_status = {};
    light.device_name = result.label;
    light.device_id = result.id;
    if (result.switch === 'on') {
      light.light_status.onoff = true;
    } else {
      light.light_status.onoff = false;
    }
    light.light_status.hue = parseInt((result.hue * 360) / 100, 10);
    light.light_status.saturation = result.saturation;
    light.light_status.brightness = result.level;
    callback_option.list.push(light);
    callback_option.result.err_no = 0;
    callback_option.result.err_msg = 'ok';
    delete callback_option.device_id;
    callback(callback_option);
  });
}


/**
 * functions exporting
 */
module.exports = stat;
