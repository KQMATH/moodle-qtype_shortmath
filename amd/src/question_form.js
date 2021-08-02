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

import { render } from "qtype_shortmath/template_preview";
import { getShortmathTemplate, getShortmathEditorconfig } from "qtype_shortmath/api_helpers";

export const init = async (questionid) => {
    let template;
    const containerId = "template-container";
    
    const select = document.querySelector('[name="editorconfig"]');
    const templateid = select.value;
    if (templateid === "-1") {
        template = await getShortmathEditorconfig(questionid);
    } else {  
        template = await getShortmathTemplate(templateid);
    }
    render(template, containerId);
    
    addSelectEventListener(select, questionid, containerId);
};


function addSelectEventListener(selectElement, questionid, containerId) {
    const container = document.getElementById(containerId);
    selectElement.addEventListener('change', async () => {
        let template;
        const templateid = selectElement.value;
        container.innerHTML = "";

        if (templateid === "-1") {
            template = await getShortmathEditorconfig(questionid);
        } else {  
            template = await getShortmathTemplate(templateid);
        }
        await render(template, containerId);
    });
}
