var React = require('react');
var ReactDOM = require('react-dom');

var AppBar = require('material-ui/lib/app-bar');

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var RebuildSearch = React.createClass({

  render: function() {
    return (
      <AppBar
        title="Rebuild Search"
          iconClassNameRight="muidocs-icon-navigation-expand-more" />
    );
  }
});

ReactDOM.render(
  <RebuildSearch/>,
  document.getElementById('content')
);
