var React = require('react');
var ReactDOM = require('react-dom');

var AppBar = require('material-ui/lib/app-bar');
var List = require('material-ui/lib/lists/list');
var ListDivider = require('material-ui/lib/lists/list-divider');
var ListItem = require('material-ui/lib/lists/list-item');


var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var RebuildSearch = React.createClass({
  getInitialState: function(){
    return {
      items: []
    };
  },

  componentDidMount: function(){
    var global_items = Items;
    this.setState({items: global_items});
  },

  render: function() {
    return (
      <div>
      <AppBar
        title="Rebuild Search"
          iconClassNameRight="muidocs-icon-navigation-expand-more" />
      <ItemList items={this.state.items} />
      </div>
    );
  }
});

var ItemList = React.createClass({
  render: function(){
    var items = this.props.items.map(function(item){
      return (<Item item={item} key={item.link}/>);
    });

    return (
      <List>
      {items}
      </List>
    );
  }
});

var Item = React.createClass({
  render: function(){
    var title = this.props.item.title.replace('&#40;','(').replace('&#41;',')');;
    return (
      <ListItem primaryText={title} />
    );
  }
});

ReactDOM.render(
  <RebuildSearch/>,
  document.getElementById('content')
);
