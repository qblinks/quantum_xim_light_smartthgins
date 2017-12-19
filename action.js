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
    url: `${option.xim_content.uri}/switchAction/${option.device_id}/${option.command}/${option.value}`,
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
  let off = false;
  // set onoff
  if (typeof option.action.onoff !== 'undefined' || typeof option.action.toggle !== 'undefined') {
    callback_option.value = 1;
    if (option.action.onoff === true) {
      callback_option.command = 'on';
    } else if (option.action.onoff === false) {
      callback_option.command = 'off';
      off = true;
    } else if (option.action.toggle === true && typeof option.xim_content.light_onoff !== 'undefined') {
      if (option.xim_content.light_onoff[option.device_id] === true) {
        callback_option.command = 'off';
        callback_option.xim_content.light_onoff[option.device_id] = false;
      } else {
        callback_option.command = 'on';
        callback_option.xim_content.light_onoff[option.device_id] = true;
      }
    }
    goaction(callback_option, (result) => {
      if (typeof result !== 'undefined') {
        callback_option.result.err_no = 0;
        callback_option.result.err_msg = 'ok';
      }
    });
  }
  // set brightness
  if (typeof option.action.brightness !== 'undefined' && off === false) {
    callback_option.value = option.action.brightness;
    callback_option.command = 'bri';
    if (callback_option.value === 0) {
      callback_option.value = 1;
    }
    goaction(callback_option, (result) => {
      if (typeof result !== 'undefined') {
        callback_option.result.err_no = 0;
        callback_option.result.err_msg = 'ok';
      }
    });
  }
  // set saturation
  if (typeof option.action.saturation !== 'undefined' && off === false) {
    callback_option.value = option.action.saturation;
    callback_option.command = 'sat';
    if (callback_option.value === 0) {
      callback_option.value = 1;
    }
    goaction(callback_option, (result) => {
      if (typeof result !== 'undefined') {
        callback_option.result.err_no = 0;
        callback_option.result.err_msg = 'ok';
      }
    });
  }
  // set hue
  if (typeof option.action.hue !== 'undefined' && off === false) {
    callback_option.value = parseInt((option.action.hue * 100) / 360, 10);
    callback_option.command = 'hue';
    goaction(callback_option, (result) => {
      if (typeof result !== 'undefined') {
        callback_option.result.err_no = 0;
        callback_option.result.err_msg = 'ok';
      }
    });
  }

  callback_option.result.err_no = 0;
  callback_option.result.err_msg = 'ok';
  delete callback_option.device_id;
  delete callback_option.action;
  delete callback_option.command;
  delete callback_option.value;
  callback(callback_option);
}

/**
 * functions exporting
 */
module.exports = action;
