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
 * @module     qtype_shortmath/editor-manager
 * @package    qtype_shortmath
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com> and Simen Wiik <simenwiik@hotmail.com>
 * @copyright  2020 NTNU
 */

import Ajax from "core/ajax";
import notification from "core/notification";
import { Popover } from "theme_boost/popover";
// import * as Str from "core/str";

export const initialize = (editorPath, pluginSettingsPath) => {
    document.querySelectorAll(".edit-template, .delete-template").forEach(element => {
        new Popover(element, {
            placement: "top",
            trigger: "hover"
        });
    });

    document.querySelectorAll(".text-truncate").forEach(element => {
        if (element.offsetWidth < element.scrollWidth) {
            new Popover(element, {
                delay: {
                    show: 0,
                    delay: 300
                },
                placement: "top",
                trigger: "hover"
            });
        }
    });

    document.querySelectorAll(".edit-template").forEach(element => {
        element.addEventListener("click", event => {
            event.preventDefault();
            const form = event.target.closest(".template-box").querySelector("form");
            form.setAttribute("action", editorPath);
            form.setAttribute("method", "post");
            form.submit();
        });
    });

    document.querySelectorAll(".delete-template").forEach(deleteButton => {
        deleteButton.addEventListener("click", event => {
            event.preventDefault();

            const form = event.target.closest(".template-box").querySelector("form");
            const templateId = form.querySelector(`input[name="templateId"]`).value;
            const templateName = form.querySelector(`input[name="templateName"]`).value;

            // title, question, saveLabel, saveCallback, cancelCallback
            notification.saveCancel(`Delete Template <b>${templateName}</b>`,
                `Delete Template <b>${templateName}</b> from database?`,
                "Delete", () => {
                // TODO: Clear notifications
                //
                Ajax.call([{
                    methodname: "qtype_shortmath_delete_template",
                    args: { questionid: templateId },
                    done: () => {
                        // Reload webpage after 200 ms to ensure the template is deleted before
                        // the page is reloaded, or else the template will still show up
                        setTimeout(() => {
                            window.location = location;
                        }, 200);
                    },
                    fail: notification.exception
                }]);
            });
        });
    });

    document.querySelector("#back").addEventListener("click", event => {
        event.preventDefault();
        window.location.replace(pluginSettingsPath);
    });

    document.querySelector("#createTemplates").addEventListener("click", event => {
        event.preventDefault();
        window.location.replace(editorPath);
    });
};