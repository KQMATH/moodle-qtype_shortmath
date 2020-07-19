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

/**
 * @module qtype_shortmath/editor-manager
 */
define(['jquery'], function ($) {
    return {
        initialize: function () {
            $('.edit-template').on('click', event => {
                event.preventDefault();
                let $form = $(event.target).closest('.box-1').find('form');
                $form.attr('action', M.str.qtype_shortmath.editor_path);
                $form.attr('method', 'post');
                $form.submit();
            });

            $('.delete-template').on('click', event => {
                event.preventDefault();
                let $templateBox = $(event.target).closest('.box-1');
                let $form = $templateBox.find('form');

                let isDelete = confirm('Remove template: '
                    + $form.find('input[name="templateName"]').val() + ' ?');
                if (!isDelete) {
                    return;
                }

                let id = $form.find('input[name="templateId"]').val();

                $.post(M.str.qtype_shortmath.editor_action_path,
                    {
                        'id': id,
                        'type': 'delete'
                    }
                ).done(message => {
                    if (message > 0) {
                        $templateBox.children().hide();
                        $templateBox.find('.d-flex').children().hide();
                        let messageDiv = $templateBox.find('.message');
                        let overlay = $('#' + $.escapeSelector('overlay-div'));
                        messageDiv.show();
                        overlay.show();
                        setTimeout(() => {
                            $templateBox.remove();
                            overlay.hide();
                        }, 5000);
                    }
                }).fail((jqXHR, textStatus, errorThrown) => {
                    console.log('error: ' + errorThrown);
                    alert(textStatus);
                });
            });

            $('#' + $.escapeSelector('back')).on('click', event => {
                event.preventDefault();
                window.location.replace(M.str.qtype_shortmath.plugin_settings_path);
            });

            $('#' + $.escapeSelector('addTemplates')).on('click', event => {
                event.preventDefault();
                window.location.replace(M.str.qtype_shortmath.editor_path);
            });
        }
    };
});
