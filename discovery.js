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
 * get the list of smartthings
 *
 * @param {object} option the xim option
 * @param {function} get_state_cb callback of this function
 */
function get_list(option, get_state_callback) {
  const get_state_options = {
    method: 'GET',
    url: `${option.xim_content.uri}/switchDiscovery`,
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
 * for xim interface
 * @param  {object}   option   input xim_content
 * @param  {Function} callback return light list
 */
function discovery(options, callback) {
  const callback_option = JSON.parse(JSON.stringify(options));
  callback_option.result = {};
   // check xim content
  if (typeof options.xim_content === 'undefined' || typeof options.xim_content.access_token === 'undefined') {
    callback_option.result.err_no = 2;
    callback_option.result.err_msg = 'access_token undefined';
    callback(callback_option);
  }
  if (typeof options.xim_content.uri) {
    callback_option.result.err_no = 3;
    callback_option.result.err_msg = 'uri undefined';
    callback(callback_option);
  }
  callback_option.list = [];
  get_list(options, (result) => {
    Object.keys(result.switches).forEach((key) => {
      const light = {};
      light.light_status = {};
      light.device_name = result.switches[key].label;
      light.device_id = result.switches[key].id;
      light.is_group = false;
      if (result.switches[key].switch === 'on') {
        light.light_status.onoff = true;
      } else {
        light.light_status.onoff = false;
      }
      light.light_status.hue = parseInt((result.switches[key].hue * 360) / 100, 10);
      light.light_status.saturation = result.switches[key].saturation;
      light.light_status.brightness = result.switches[key].level;
      callback_option.list.push(light);
    });
    callback_option.result.err_no = 0;
    callback_option.result.err_msg = 'ok';
    callback(callback_option);
  });
}


/**
 * functions exporting
 */
module.exports = discovery;
