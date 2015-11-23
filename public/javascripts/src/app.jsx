var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');

var AppBar = require('material-ui/lib/app-bar');
var IconButton = require('material-ui/lib/icon-button');
var FlatButton = require('material-ui/lib/flat-button');

var Dialog = require('material-ui/lib/dialog');

var TextField = require('material-ui/lib/text-field');
var Badge = require('material-ui/lib/badge');

var List = require('material-ui/lib/lists/list');
var ListDivider = require('material-ui/lib/lists/list-divider');
var ListItem = require('material-ui/lib/lists/list-item');

var Paper = require('material-ui/lib/paper');

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
      is_searching: false,
      is_open_dialog: false
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
    this.setState({
      current_item: this.state.items[index],
      is_open_dialog: true
    });
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

  handleRequestClose: function(){
    this.setState({is_open_dialog: false});
  },

  render: function() {
    return (
      <div className="container">
        <DetailDialog item={this.state.current_item} isOpening={this.state.is_open_dialog} handleRequestClose={this.handleRequestClose} />
        <div className="header">
          <AppBar title="Rebuild Search" iconElementRight={<FlatButton label="Github" onClick={this.clickGithubLink} />} />
          <a ref="github_link" target="_blank" href="https://github.com/volpe28v/RebuildSearch"></a>
        </div>
        <SearchForm count={this.state.showing_items_count} is_searching={this.state.is_searching} onChange={this.searchItems}/>
        <ItemList items={this.state.items} onClick={this.selectItem} />
      </div>
    );
  }
});

var DetailDialog = React.createClass({
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

  _handleRequestClose: function(){
    this.props.handleRequestClose();
  },

  render: function(){
    if (this.props.item){
      var title = this.unEscapeHTML(this.props.item.title);
      return (
        <Dialog
          title={title}
          open={this.props.isOpening}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          onRequestClose={this._handleRequestClose}
          modal={false}
        >
          <DetailText item={this.props.item}/>
        </Dialog>
      )
    }else{
      return (
          <div></div>
      )
    }
  }
});

var DetailText= React.createClass({
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
      var date = moment(this.props.item.pubDate).format("YYYY-MM-DD");

      return (
        <div className="item-detail">
          <h3>{date}</h3>
          <div><a href={this.props.item.link}>Rebuild.fm</a></div>
          <div dangerouslySetInnerHTML={desc}></div>
        </div>
      );
    }else{
      return (<div></div>);
    }
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
      <div className="contents">
      {items}
      </div>
    );
  }
});

var Item = React.createClass({
  _onClick: function(){
    this.props.onClick(this.props.index);
  },

  render: function(){
    var className = 'item';
    if (this.props.item.is_visible != null && !this.props.item.is_visible){
      className += ' hide';
    }

    var title = this.props.item.title.replace('&#40;','(').replace('&#41;',')');;
    var date = moment(this.props.item.pubDate).format("YYYY-MM-DD");
    return (
      <Paper
        className={className}
        onClick={this._onClick}
        zDepth={1}>
        <p>{title} <span className="item-date">{date}</span></p>
      </Paper>
    );
  }
});

      //<ListItem className={className} primaryText={title} onClick={this._onClick}/>
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
      var date = moment(this.props.item.pubDate).format("YYYY-MM-DD");

      return (
        <div className="item-detail">
          <Card>
            <CardTitle
              title={title}
              subtitle={date}
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
