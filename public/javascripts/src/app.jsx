var React = require('react');
var ReactDOM = require('react-dom');

var AppBar = require('material-ui/lib/app-bar');
var IconButton = require('material-ui/lib/icon-button');
var FlatButton = require('material-ui/lib/flat-button');

var TextField = require('material-ui/lib/text-field');
var Badge = require('material-ui/lib/badge');

var List = require('material-ui/lib/lists/list');
var ListDivider = require('material-ui/lib/lists/list-divider');
var ListItem = require('material-ui/lib/lists/list-item');

var Card = require('material-ui/lib/card/card');
var CardActions = require('material-ui/lib/card/card-actions');
var CardExpandable = require('material-ui/lib/card/card-expandable');
var CardHeader = require('material-ui/lib/card/card-header');
var CardMedia = require('material-ui/lib/card/card-media');
var CardText = require('material-ui/lib/card/card-text');
var CardTitle = require('material-ui/lib/card/card-title');

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var RebuildSearch = React.createClass({
  getInitialState: function(){
    return {
      items: [],
      current_item: null,
      showing_items_count: 0,
      is_searching: false
    };
  },

  componentDidMount: function(){
    var global_items = Items;
    this.setState({
      items: global_items,
      current_item: global_items[0],
      showing_items_count: global_items.length
    });
  },

  selectItem: function(index){
    this.setState({current_item: this.state.items[index]});
  },

  searchItems: function(keyword){
    var show_count = 0;
    var is_searching = false;
    var current_item = null;
    if (keyword == ''){
      var updated_items = this.state.items.map(function(item){
        item.is_visible = true;
        show_count++;
        if (current_item == null){ current_item = item; }
        return item;
      });
    }else{
      var reg = new RegExp(keyword,'i');
      var updated_items = this.state.items.map(function(item){
        if (reg.test(item.description)){
          item.is_visible = true;
          show_count++;
          if (current_item == null){ current_item = item; }
        }else{
          item.is_visible = false;
        }
        return item;
      });
      is_searching = true;
    }

    this.setState({
      items: updated_items,
      showing_items_count: show_count,
      is_searching: is_searching,
      current_item: current_item
    });
  },

  clickGithubLink: function(){
    this.refs.github_link.click();
  },

  render: function() {
    return (
      <div className="container">
        <div className="header">
          <AppBar title="Rebuild Search" iconElementRight={<FlatButton label="Github" onClick={this.clickGithubLink} />} />
          <a ref="github_link" target="_blank" href="https://github.com/volpe28v/RebuildSearch"></a>
        </div>

        <div className="wrapper">
          <div className="left">
            <SearchForm count={this.state.showing_items_count} is_searching={this.state.is_searching} onChange={this.searchItems}/>
            <ItemList items={this.state.items} onClick={this.selectItem} />
          </div>
          <div className="right">
            <ItemDetail item={this.state.current_item} />
          </div>
        </div>
      </div>
    );
  }
});

var SearchForm = React.createClass({
  _onChange: function(){
    var keyword = this.refs.searchForm.getValue();
    this.props.onChange(keyword);
  },

  render: function(){
    var primary = false;
    var secondary = true;
    if (this.props.is_searching){
      primary = true;
      secondary = false;
    }
    return (
      <div className="search-form">
        <Badge badgeContent={this.props.count} primary={primary} secondary={secondary} badgeStyle={{top:36, right:-30, width:40}}>
          <TextField ref="searchForm" hintText="Keyword" onChange={this._onChange} />
        </Badge>
      </div>
    );
  }
});

var ItemList = React.createClass({
  render: function(){
    var that = this;
    var items = this.props.items.map(function(item,index){
      return (<Item item={item} key={item.link} index={index} onClick={that.props.onClick} />);
    });

    return (
      <List>
      {items}
      </List>
    );
  }
});

var Item = React.createClass({
  _onClick: function(){
    this.props.onClick(this.props.index);
  },

  render: function(){
    var className = '';
    if (this.props.item.is_visible != null && !this.props.item.is_visible){
      className = 'hide';
    }

    var title = this.props.item.title.replace('&#40;','(').replace('&#41;',')');;
    return (
      <ListItem className={className} primaryText={title} onClick={this._onClick}/>
    );
  }
});

var ItemDetail = React.createClass({
  unEscapeHTML: function (str) {
    return str
            .replace(/(&lt;)/g, '<')
            .replace(/(&gt;)/g, '>')
            .replace(/(&quot;)/g, '"')
            .replace(/(&#35;)/g, "#")
            .replace(/(&#39;)/g, "'")
            .replace(/(&#40;)/g, "(")
            .replace(/(&#41;)/g, ")")
            .replace(/(&amp;)/g, '&')
  },

  render: function(){
    if (this.props.item){
      var title = this.unEscapeHTML(this.props.item.title);
      var desc = {__html: this.unEscapeHTML(this.props.item.description)};

      return (
        <div className="item-detail">
          <Card>
            <CardTitle
              title={title}
              subtitle={this.props.item.pubDate}
            />
            <CardText>
              <div><a href={this.props.item.link}>Rebuild.fm</a></div>
              <div dangerouslySetInnerHTML={desc}></div>
            </CardText>
          </Card>
        </div>
      );
    }else{
      return (<div></div>);
    }
  }
});

ReactDOM.render(
  <RebuildSearch/>,
  document.getElementById('content')
);
