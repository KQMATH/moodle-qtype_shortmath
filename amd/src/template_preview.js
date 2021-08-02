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
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2020 NTNU
 */

import VisualMath from "qtype_shortmath/visual-math-input";
import { getShortmathTemplate } from "qtype_shortmath/api_helpers";

export const init = async (templateId, containerId) => {
    const template = await getShortmathTemplate(templateId);
    await render(template, containerId);
};


export const render = async (template, containerId) => {
    let templateObj = tryParseJSON(template)
    if (!templateObj) {
        templateObj = template;
    }
    var controlsWrapper = document.getElementById(containerId);
    var controls = new VisualMath.ControlList(controlsWrapper);
    templateObj.forEach(value => {
        let html = value['button'];
        let command = value['expression'];
        controls.define(command, html);
    });
    controls.enableAll();
};

function tryParseJSON(jsonString) {
    try {
        var o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return false;
};