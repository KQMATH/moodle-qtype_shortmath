// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * @module     qtype_shortmath/api_helpers
 * @package    qtype_shortmath
 * @author     Simen Wiik <simenwiik@hotmail.com>
 * @copyright  2021 NTNU
 */

import Ajax from "core/ajax";
import notification from "core/notification";

/**
 * Retrieves the shortmath template with given id
 *
 * @param {int} templateId id of the template, according to mdl_qtype_shortmath_templates
 *                         table in the database
 */
export const getShortmathTemplate = async (templateId) => {

  // Since "done" takes a callback function, we have to wait for the
  // callback function to complete before the ajax call returns the result
  const template = await new Promise(resolve => {

    Ajax.call([{
      methodname: "qtype_shortmath_get_template",
      args: { id: templateId },
      done: foundTemplate => {
        resolve(JSON.parse(foundTemplate.template));
      },
      fail: notification.exception || defaultFailCallback(`Couldn't get template with id ${templateId}`)
    }]);
  });

  return template;
};

/**
 * Retrieves the editorconfig for the given shortmath question id.
 *
 * @param {int} questionId id of the question, according to mdl_qtype_shortmath_options
 *                         table in the database
 */
export const getShortmathEditorconfig = async (questionId) => {

  // Since "done" takes a callback function, we have to wait for the
  // callback function to complete before the ajax call returns the result
  const editorconfig = await new Promise(resolve => {

    Ajax.call([{
      methodname: "qtype_shortmath_get_editor_config",
      args: { id: questionId },
      done: foundTemplate => {
        resolve(JSON.parse(foundTemplate.editorconfig));
      },
      fail: notification.exception || defaultFailCallback(`Couldn't get editor configuration for question with id ${questionId}`)
    }]);
  });

  return editorconfig;
};

/**
 * Saves shortmath template
 * 
 * @param {string} name Name of the template
 * @param {string} template Template as a string in JSON format
 * @param {int} templateId id of the template, according to mdl_qtype_shortmath_templates
 *                         table in the database
 */
export const saveShortmathTemplate = async (name, template, templateId) => {

  const succeeded = await new Promise(resolve => {
    Ajax.call([{
      methodname: "qtype_shortmath_save_template",
      args: { name, template, templateId },
      done: resolve,
      fail: notification.exception || notification.addNotification({
        message: `Couldn't save template ${name}`,
        type: "error"
      })
    }]);
  });

  return succeeded;
};

/**
 * Deletes the shortmath template with given id
 *
 * @param {int} templateId id of the template, according to mdl_qtype_shortmath_templates
 *                         table in the database
 */
export const deleteShortmathTemplate = async (templateId) => {
  const succeeded = await new Promise(resolve => {
    Ajax.call([{
      methodname: "qtype_shortmath_delete_template",
      args: { id: templateId },
      done: resolve,
      fail: notification.exception
    }]);
  });
  return succeeded;
}

const defaultFailCallback = message => () => {
  notification.addNotification({ message, type: "error" });
};