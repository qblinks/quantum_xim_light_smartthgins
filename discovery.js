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
  // this is an empty function to be implemented or a place holder
  callback_option.list = [];
  get_list(options, (result) => {
    Object.keys(result.switches).forEach((key) => {
      const light = {};
      light.device_name = result.switches[key].devtest.name;
      light.device_id = result.switches[key].devtest.id;
      callback_option.list.push(light);
    });
    callback(callback_option);
  });
}


/**
 * functions exporting
 */
module.exports = discovery;
