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

    function getAttribute(attributes, name) {

        // Return the attribute name if it's true in the attributes
        if (attributes != null &&
            manywho.utils.isNullOrWhitespace(attributes[name]) == false) {

            if (attributes[name].toLowerCase() == 'true') {
                return name;
            }
        }

        return '';

    }

    function getUrlParameter(sharedLink, attributes, name) {

        if (attributes != null &&
            attributes[name] != null) {
            sharedLink += name + '=' + attributes[name];
        }

        return sharedLink;

    }

    var boxView = React.createClass({

        render: function () {

            manywho.log.info('Rendering Box.com View: ' + this.props.id);

            var viewUrl = null;
            var model = manywho.model.getComponent(this.props.id, this.props.flowKey);

            if (model.tags != null &&
                model.tags.length > 0) {

                for (var i = 0; i < model.tags.length; i++) {

                    if (model.tags[i].developerName.toLowerCase() == 'box_view_url') {

                        viewUrl = model.tags[i].contentValue;
                        break;

                    }

                }

            }

            // Make sure the view url has been provided
            if (manywho.utils.isNullOrWhitespace(viewUrl)) {

                manywho.log.info('A Box.com box_view_url must be provided for this component to work. You can get the url from Box.com using the following instructions: https://box-view.readme.io/reference#view-a-document');
                return;

            }

            // Get the additional customizations out from the attributes
            viewUrl += '?';
            viewUrl = getUrlParameter(viewUrl, model.attributes, 'theme');

            return React.DOM.iframe({
                id: this.props.id,
                src: viewUrl,
                style: { width: model.width + 'px', height: model.height + 'px', 'border-radius': '5px', border: '1px solid #d9d9d9' },
                'allowfullscreen': getAttribute(model.attributes, 'allowfullscreen')
            });

        }

    });

    manywho.component.register("box-view", boxView, ['box_view']);

}(manywho));