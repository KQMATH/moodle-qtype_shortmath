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
 * @module     qtype_shortmath/editor_manager
 * @package    qtype_shortmath
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @author     Simen Wiik <simenwiik@hotmail.com>
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2020 NTNU
 */

import notification from "core/notification";
import { deleteShortmathTemplate } from "qtype_shortmath/api_helpers";
import { Popover } from "theme_boost/popover";
import * as Str from 'core/str';

export const initialize = async () => {
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


    document.querySelectorAll(".delete-template").forEach(deleteButton => {
        deleteButton.addEventListener("click", async event => {
            event.preventDefault();
            event.stopPropagation();
            const element = event.currentTarget;
            const templateId = parseInt(element.getAttribute('data-id'));
            const templateName = element.getAttribute('data-name');

            notification.saveCancel(
                await Str.get_string('deltemplate', 'qtype_shortmath'),
                await Str.get_string('deltemplateconfirm', 'qtype_shortmath', templateName),
                await Str.get_string('delete', 'core'),
                async function () {
                    await deleteShortmathTemplate(templateId);
                    element.closest("tr").remove();
                });
        });
    });
};
