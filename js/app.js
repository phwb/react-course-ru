// TODO закончил на React.propTypes

var newsList = [
  {
    author: 'Саша Печкин',
    text: 'В четверг, четвертого числа...'
  },
  {
    author: 'Просто Вася',
    text: 'Считаю, что $ должен стоить 35 рублей!'
  },
  {
    author: 'Гость',
    text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000'
  }
];

var Article = React.createClass({
  propTypes: {
    data: React.PropTypes.shape({
      author: React.PropTypes.string.isRequired,
      text: React.PropTypes.string.isRequired
    })
  },

  render: function () {
    var data = this.props.data;
    return (
      <div className="article">
        <p className="news__author">{data.author}:</p>
        <p className="news__text">{data.text}</p>
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

var App = React.createClass({
  render: function () {
    return (
      <div className="app">
        <h3>Новости</h3>
        <News data={newsList} />
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);