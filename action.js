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
 * action to api
 *
 * @param {object} option the xim option
 * @param {string} [command] [the action command]
 * @param {function} callback of this function
 */
function goaction(option, callback) {
  const goaction_options = {
    method: 'PUT',
    url: `${option.xim_content.uri}/switchAction/${option.device_id}/${option.command}`,
    headers: {
      authorization: `Bearer ${option.xim_content.access_token}`,
    },
  };
  request(goaction_options, (error) => {
    // const contact = JSON.parse(body);
    if (error) {
      callback(false);
    }
    callback(true);
  });
}
/**
 * [action description]
 * @param  {object} option Light action properties
 * @return {bool}        seccess or fail
 */
function action(option, callback) {
  const callback_option = JSON.parse(JSON.stringify(option));
  callback_option.result = {};
  // check xim content
  if (typeof option.xim_content === 'undefined' || typeof option.xim_content.access_token === 'undefined') {
    callback_option.result.err_no = 2;
    callback_option.result.err_msg = 'access_token undefined';
    callback(callback_option);
  }
  if (typeof option.xim_content.uri === 'undefined') {
    callback_option.result.err_no = 3;
    callback_option.result.err_msg = 'uri undefined';
    callback(callback_option);
  }
  // set onoff
  if (typeof option.action.onoff !== 'undefined') {
    if (option.action.onoff === true) {
      callback_option.command = 'on';
    } else {
      callback_option.command = 'off';
    }
  }
  // set color

  goaction(callback_option, (result) => {
    if (typeof result !== 'undefined') {
      callback_option.result.err_no = 0;
      callback_option.result.err_msg = 'ok';
    }
    delete callback_option.device_id;
    delete callback_option.action;
    delete callback_option.command;
    callback(callback_option);
  });
}

/**
 * functions exporting
 */
module.exports = action;
