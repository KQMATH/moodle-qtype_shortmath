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
define(['jquery', 'core/notification', 'theme_boost/tooltip', 'theme_boost/popover'],
    function ($, notification) {
        return {
            initialize: () => {
                $('.edit-template, .delete-template').each((index, element) => {
                    $(element).tooltip({
                        container: element.parentElement
                    });
                });

                $('.text-truncate').each((index, element) => {
                    let $ele = $(element);
                    if (element.offsetWidth < element.scrollWidth) {
                        $ele.popover({
                            container: element,
                            delay: {
                                show: 0,
                                delay: 300
                            },
                            placement: 'top',
                            trigger: 'hover'
                        });
                    } else {
                        $ele.attr('title', '');
                    }
                });

                $('.edit-template').click(event => {
                    event.preventDefault();
                    let $form = $(event.target).closest('.template-box').find('form');
                    $form.attr('action', M.str.qtype_shortmath.editor_path);
                    $form.attr('method', 'post');
                    $form.submit();
                });

                $('.delete-template').click(event => {
                    event.preventDefault();

                    let $templateBox = $(event.target).closest('.template-box');
                    let $form = $templateBox.find('form');
                    let id = $form.find('input[name="templateId"]').val();

                    notification.confirm('Delete Template',
                        `Delete<b>&nbsp;${$form.find('input[name="templateName"]').val()}&nbsp;</b>from database?`,
                        'OK', 'Cancel', () => {
                            // Clear notifications
                            $('.alert').alert('close');

                            $.post(M.str.qtype_shortmath.editor_action_path,
                                {
                                    'id': id,
                                    'type': 'delete'
                                }
                            ).done(message => {
                                if (message > 0) {
                                    notification.addNotification({
                                        message: "Template deleted!",
                                        type: "success"
                                    });
                                    $templateBox.remove();
                                } else {
                                    notification.addNotification({
                                        message: "Something went wrong!",
                                        type: "error"
                                    });
                                }
                            }).fail((jqXHR, textStatus, errorThrown) => {
                                notification.addNotification({
                                    message: textStatus + ': ' + errorThrown,
                                    type: "error"
                                });
                            });
                        });
                });

                $('#' + $.escapeSelector('back')).click(event => {
                    event.preventDefault();
                    window.location.replace(M.str.qtype_shortmath.plugin_settings_path);
                });

                $('#' + $.escapeSelector('createTemplates')).click(event => {
                    event.preventDefault();
                    window.location.replace(M.str.qtype_shortmath.editor_path);
                });
            }
        };
    });
