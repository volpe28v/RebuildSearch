var React = require('react');
var ReactDOM = require('react-dom');

var AppBar = require('material-ui/lib/app-bar');

var TextField = require('material-ui/lib/text-field');

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
      search_word: null
    };
  },

  componentDidMount: function(){
    var global_items = Items;
    this.setState({
      items: global_items,
      current_item: global_items[0]
    });
  },

  selectItem: function(index){
    this.setState({current_item: this.state.items[index]});
  },

  searchItems: function(){
    var keyword = this.refs.searchForm.getValue();
    if (keyword == ''){
      this.setState({search_word: null});
    }else{
      this.setState({search_word: new RegExp(keyword,'i')});
    }
  },

  render: function() {
    return (
      <div className="container">
        <div className="header">
          <AppBar
            title="Rebuild Search"
            iconClassNameRight="muidocs-icon-navigation-expand-more" />
        </div>

        <div className="wrapper">
          <div className="left">
            <div className="search-form">
              <TextField ref="searchForm" hintText="Keyword" onChange={this.searchItems} />
            </div>
            <ItemList items={this.state.items} keyword={this.state.search_word} onClick={this.selectItem} />
          </div>
          <div className="right">
            <ItemDetail item={this.state.current_item} />
          </div>
        </div>
      </div>
    );
  }
});

var ItemList = React.createClass({
  render: function(){
    var that = this;
    var items = this.props.items.map(function(item,index){
      return (<Item item={item} keyword={that.props.keyword} key={item.link} index={index} onClick={that.props.onClick} />);
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
    if (this.props.keyword != null && !this.props.keyword.test(this.props.item.description)){
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
