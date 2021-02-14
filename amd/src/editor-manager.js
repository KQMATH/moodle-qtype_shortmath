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
 * @package    qtype_shortmath
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright  2020 NTNU
 */
import Ajax from "../../../../lib/amd/build/ajax.min.js";
/**
 * @module qtype_shortmath/editor-manager
 */
// import * as Str from "core/str";
export const initialize = (editorPath, actionPath, pluginSettingsPath) => {
    const _templateElements = document.querySelectorAll(".edit-template, .delete-template");
    // Since the NodeList type doesn't support iteration, convert it to the Array type
    const templateElements = Array.from(_templateElements);
    for (const element of templateElements) {
        // Create a tooltip with something inside it
    }
    // $('.edit-template, .delete-template').each((index, element) => {
    //     $(element).tooltip({
    //         container: element.parentElement
    //     });
    // });

    const _truncateElements = document.querySelectorAll(".text-truncate");
    // Since the NodeList type doesn't support iteration, convert it to the Array type
    const truncateElements = Array.from(_truncateElements);
    for (const element of truncateElements) {
        if (element.offsetWidth < element.scrollWidth) {
            // If the element overflows its parent, show
            // a popover (???) when you hover over
            // the element
        }
    }

    // $('.text-truncate').each((index, element) => {
    //     let $ele = $(element);
    //     if (element.offsetWidth < element.scrollWidth) {
    //         $ele.popover({
    //             container: element,
    //             delay: {
    //                 show: 0,
    //                 delay: 300
    //             },
    //             placement: 'top',
    //             trigger: 'hover'
    //         });
    //     } else {
    //         $ele.attr('title', '');
    //     }
    // });


    const _editTemplateElements = document.querySelectorAll(".edit-template");
    const editTemplateElements = Array.from(_editTemplateElements);
    for (const element of editTemplateElements) {
        element.addEventListener("click", event => {
            event.preventDefault();
            const form = event.target.closest(".template-box").querySelector("form");
            form.setAttribute("action", editorPath);
            form.setAttribute("method", "post");
            form.submit();
        });
    }

    // $('.edit-template').click(event => {
    //     event.preventDefault();
    //     let $form = $(event.target).closest('.template-box').find('form');
    //     $form.attr('action', editorPath);
    //     $form.attr('method', 'post');
    //     $form.submit();
    // });

    document.querySelector(".delete-template").addEventListener("click", event => {
        event.preventDefault();

        const templateBox = event.target.closest(".template-box");
        const form = templateBox.querySelector("form");
        const templateId = form.querySelector(`input[name="templateId"`);

        const templateName = form.querySelector(`input[name="templateName"`).value;

        // I'm guessing Moodle as a system has measures to prevent XSS?
        notification.confirm(`Delete Template <b>${templateName}</b> from database?`, "OK", "Cancel", () => {
            // Clear notifications
            // The jQuery solution uses a 3rd party alert plugin. I have
            // no idea what the result of ".alert("close")" is supposed
            // to be
            document.querySelector(".alert");

            // Not sure what to do about the whole ajax section.
            // The moodle docs for it aren't that great,
            // and I'll read up on it sometime later
            const promises = Ajax.call([
                {}
            ]);

            promises[0].done(response => {

            });
        });
    });

    // $('.delete-template').click(event => {
    //     event.preventDefault();

    //     let $templateBox = $(event.target).closest('.template-box');
    //     let $form = $templateBox.find('form');
    //     let id = $form.find('input[name="templateId"]').val();

    //     notification.confirm('Delete Template',
    //         `Delete<b>&nbsp;${$form.find('input[name="templateName"]').val()}&nbsp;</b>from database?`,
    //         'OK', 'Cancel', () => {
    //             // Clear notifications
    //             $('.alert').alert('close');

    //             $.post(actionPath,
    //                 {
    //                     'id': id,
    //                     'type': 'delete'
    //                 }
    //             ).done(message => {
    //                 if (message > 0) {
    //                     notification.addNotification({
    //                         message: "Template deleted!",
    //                         type: "success"
    //                     });
    //                     $templateBox.remove();
    //                 } else {
    //                     notification.addNotification({
    //                         message: "Something went wrong!",
    //                         type: "error"
    //                     });
    //                 }
    //             }).fail((jqXHR, textStatus, errorThrown) => {
    //                 notification.addNotification({
    //                     message: textStatus + ': ' + errorThrown,
    //                     type: "error"
    //                 });
    //             });
    //         });
    // });

    document.querySelector("#back").addEventListener("click", event => {
        event.preventDefault();
        window.location.replace(pluginSettingsPath);
    });

    document.querySelector("#createTemplates").addEventListener("click", event => {
        event.preventDefault();
        window.location.replace(editorPath);
    });

    // $('#' + $.escapeSelector('back')).click(event => {
    //     event.preventDefault();
    //     window.location.replace(pluginSettingsPath);
    // });

    // $('#' + $.escapeSelector('createTemplates')).click(event => {
    //     event.preventDefault();
    //     window.location.replace(editorPath);
    // });
};
