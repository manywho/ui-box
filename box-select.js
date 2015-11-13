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

    var boxSelect;

    function convertResponseToBoxFiles(response) {

        var boxFiles = null;

        if (response != null &&
            response.length > 0) {

            boxFiles = [];

            for (var i = 0; i < response.length; i++) {

                boxFiles.push({
                    "externalId": response[i].id,
                    "developerName": "File",
                    "isSelected": true,
                    "properties": [
                        {
                            "developerName": "ID",
                            "contentValue": response[i].id
                        },
                        {
                            "developerName": "Name",
                            "contentValue": response[i].name
                        },
                        {
                            "developerName": "Download Uri",
                            "contentValue": response[i].url
                        },
                        {
                            "developerName": "Size",
                            "contentValue": response[i].size
                        }
                    ]
                });

            }

        }

        return boxFiles;

    }

    var boxFilePicker = React.createClass({

        componentDidMount: function () {

            boxSelect = new BoxSelect();

            // Register a success callback handler
            boxSelect.success(function(response) {

                var model = manywho.model.getComponent(this.props.id, this.props.flowKey);
                model.objectData = null;

                manywho.state.setComponent(this.props.id, { objectData: convertResponseToBoxFiles(response) }, this.props.flowKey, true);
                manywho.component.handleEvent(this, model, this.props.flowKey);

            });

            // Register a cancel callback handler
            boxSelect.cancel(function() {

                var model = manywho.model.getComponent(this.props.id, this.props.flowKey);
                model.objectData = null;

                manywho.state.setComponent(this.props.id, { objectData: null }, this.props.flowKey, true);
                manywho.component.handleEvent(this, model, this.props.flowKey);

            });

        },

        componentWillUnmount: function () {

            boxSelect = null;

        },

        render: function () {

            manywho.log.info('Rendering Box.com File Picker: ' + this.props.id);

            var clientId = null;
            var model = manywho.model.getComponent(this.props.id, this.props.flowKey);

            if (model.tags != null &&
                model.tags.length > 0) {

                for (var i = 0; i < model.tags.length; i++) {

                    if (model.tags[i].developerName.toLowerCase() == 'box_client_id') {

                        clientId = model.tags[i].contentValue;
                        break;

                    }

                }

            }

            // Make sure the client id has been provided
            if (manywho.utils.isNullOrWhitespace(clientId)) {

                manywho.log.info('A Box.com client_id must be provided for this component to work. You can provision a Box Application here: https://app.box.com/developers/services to get your client_id.');
                return;

            }

            return React.DOM.div({
                id: this.props.id,
                'data-link-type': 'shared',
                'data-multiselect': model.isMultiSelect,
                'data-client-id': clientId }, null)
            );

        }

    });

    manywho.component.register("box-select", boxFilePicker, ['box_select']);

}(manywho));