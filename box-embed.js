/*!
 Copyright 2015 ManyWho, Inc.
 Licensed under the ManyWho License, Version 1.0 (the "License"); you may not use this
 file except in compliance with the License.
 You may obtain a copy of the License at: http://manywho.com/sharedsource
 Unless required by applicable law or agreed to in writing, software distributed under
 the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied. See the License for the specific language governing
 permissions and limitations under the License.
 */

(function (manywho) {

    function getUrlParameter(sharedLink, attributes, name) {

        if (attributes != null &&
            attributes[name] != null) {
            sharedLink += name + '=' + attributes[name];
        }

        return sharedLink;

    }

    var boxEmbed = React.createClass({

        render: function () {

            manywho.log.info('Rendering Box.com Embed: ' + this.props.id);

            var sharedLink = null;
            var model = manywho.model.getComponent(this.props.id, this.props.flowKey);

            if (model.tags != null &&
                model.tags.length > 0) {

                for (var i = 0; i < model.tags.length; i++) {

                    if (model.tags[i].developerName.toLowerCase() == 'box_shared_link') {

                        sharedLink = model.tags[i].contentValue;
                        break;

                    }

                }

            }

            // Make sure the shared link has been provided
            if (manywho.utils.isNullOrWhitespace(sharedLink)) {

                manywho.log.info('A Box.com box_shared_link must be provided for this component to work. You can get the link from Box.com using the following instructions: https://box-content.readme.io/docs/box-embed');
                return;

            }

            // Get the additional customizations out from the attributes
            sharedLink += '?';
            sharedLink = getUrlParameter(sharedLink, model.attributes, 'view');
            sharedLink = getUrlParameter(sharedLink, model.attributes, 'sort');
            sharedLink = getUrlParameter(sharedLink, model.attributes, 'direction');
            sharedLink = getUrlParameter(sharedLink, model.attributes, 'theme');
            sharedLink = getUrlParameter(sharedLink, model.attributes, 'show_parent_path');
            sharedLink = getUrlParameter(sharedLink, model.attributes, 'show_item_feed_actions');
            sharedLink = getUrlParameter(sharedLink, model.attributes, 'promoted_app_ids');
            sharedLink = getUrlParameter(sharedLink, model.attributes, 'session_expired');
            sharedLink = getUrlParameter(sharedLink, model.attributes, 'view_file_only');

            var allowfullscreen = getUrlParameter(sharedLink, model.attributes, 'allowfullscreen');

            return React.DOM.iframe({
                id: this.props.id,
                src: sharedLink,
                width: model.width,
                height: model.height,
                frameborder: '0',
                'allowfullscreen': allowfullscreen
            });

        }

    });

    manywho.component.register("box-embed", boxEmbed, ['box_embed']);

}(manywho));