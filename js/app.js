'use strict';

var newsList = [
  {
    author: 'Саша Печкин',
    text: 'В четверг, четвертого числа...',
    bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
  },
  {
    author: 'Просто Вася',
    text: 'Считаю, что $ должен стоить 35 рублей!',
    bigText: 'А евро 42!'
  },
  {
    author: 'Гость',
    text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
    bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
  }
];

window.ee = new EventEmitter();

var Article = React.createClass({
  propTypes: {
    data: React.PropTypes.shape({
      author: React.PropTypes.string.isRequired,
      text: React.PropTypes.string.isRequired,
      bigText: React.PropTypes.string.isRequired
    })
  },

  getInitialState: function () {
    return {
      visible: false
    };
  },

  readmoreClick: function (e) {
    e.preventDefault();
    this.setState({
      visible: true
    }, null);
  },

  render: function () {
    var data = this.props.data,
      author = data.author,
      text = data.text,
      bigText = data.bigText;

    var visible = this.state.visible;

    return (
      <div className="article">
        <p className="news__author">{author}:</p>
        <p className="news__text">{text}</p>
        <a href="#"
           onClick={this.readmoreClick}
           className={"news__readmore " + (visible ? 'none' : '')}>Подробнее</a>
        <p className={"news__big-text " + (visible ? '' : 'none')}>{bigText}</p>
      </div>
    );
  }
});

var News = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },

  render: function () {
    var data = this.props.data;
    var newsTemplate;

    if (data.length > 0) {
      newsTemplate = data.map(function (item, index) {
        return (
          <div key={'news__item_' + index}>
            <Article data={item} />
          </div>
        );
      });
    } else {
      newsTemplate = <p>К сожалению новостей нет</p>;
    }

    return (
      <div className="news">
        {newsTemplate}
        <strong className={ 'news__count ' + (data.length > 0 ? '' : 'none') }>Всего новостей: { data.length }</strong>
      </div>
    );
  }
});

var Add = React.createClass({
  componentDidMount: function() {
    ReactDOM.findDOMNode(this.refs.author).focus();
  },

  onBtnClickHandler: function (e) {
    e.preventDefault();
    var author = ReactDOM.findDOMNode(this.refs.author).value;
    var text = ReactDOM.findDOMNode(this.refs.text).value;

    let item = [{
      author: author,
      text: text,
      bigText: '...'
    }];
    ee.emit('news.add', item);
  },

  getInitialState: function () {
    return {
      agreeNotChecked: true,
      authorIsEmpty: true,
      textIsEmpty: true
    };
  },

  onCheckRulesClick: function () {
    this.setState({
      agreeNotChecked: !this.state.agreeNotChecked
    }, null);
  },

  onFieldChange: function (field, e) {
    this.setState({
      [field]: !e.target.value.trim()
    }, null)
  },

  render: function () {
    let {
      agreeNotChecked,
      authorIsEmpty,
      textIsEmpty
    } = this.state;

    return (
      <form className="add cf">
        Автор:
        <input
          onChange={ this.onFieldChange.bind(this, 'authorIsEmpty') }
          type="text"
          className="add__author"
          ref="author"
          placeholder='ваше имя' />

        Текст новости:
        <textarea
          onChange={ this.onFieldChange.bind(this, 'textIsEmpty') }
          className='add__text'
          placeholder="Текст новости"
          ref="text" />

        <label className="add__checkrule">
          <input
            onChange={ this.onCheckRulesClick }
            ref="checkrule"
            type="checkbox" /> я согласен с правилами
        </label>

        <button
          className="add__btn"
          ref="alertButton"
          disabled={ agreeNotChecked || authorIsEmpty || textIsEmpty }
          onClick={ this.onBtnClickHandler }>Добавить новость</button>
      </form>
    );
  }
});

var App = React.createClass({
  getInitialState: function () {
    return {
      news: newsList
    };
  },

  componentDidMount: function () {
    ee.addListener('news.add', item => this.setState({
      news: item.concat(this.state.news)
      // news: [...item, this.state.news]
    }, null));
  },

  componentWillUnmount: function () {
    ee.removeListener('news.add');
  },

  render: function () {
    return (
      <div className="app">
        <Add />
        <h3>Новости</h3>
        <News data={ this.state.news } />
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
