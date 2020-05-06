import React from 'react';
import style from './home.module.scss';
import { useHistory } from 'react-router-dom';
import { LineChart } from './components/LineChart/LineChart';
import { useDispatch, useSelector } from 'react-redux';
import { getNews, changeCount, hideItem } from '../../store/actions';
import { getParams } from '../../utils/getParams';

export const Home = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { pageNumber } = getParams(history.location.pathname);
  const { news } = useSelector((state) => {
    return {
      news: state.news,
    };
  });

  const pageChange = (prev) => {
    const page = Number(pageNumber) + (prev ? -1 : 1);
    history.push(`/${page > 0 ? page : 0}/page`);
  };

  const getTimeDiff = (date) => {
    const now = new Date();
    const date1 = new Date(date);
    const seconds = Math.floor((now - date1) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + ' years';
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + ' months';
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + ' days';
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + ' hours';
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
  };

  const extractHostname = (url) => {
    if (url === null) {
      return '';
    }

    let hostname;

    //find & remove protocol (http, ftp, etc.) and get hostname
    if (url.indexOf('//') > -1) {
      hostname = url.split('/')[2];
    } else {
      hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];

    //find & remove query string
    hostname = hostname.split('?')[0];

    return hostname;
  };

  React.useEffect(() => {
    dispatch(getNews(Number(pageNumber)));
  }, [pageNumber]);

  return (
    <div>
      <table className={style.table}>
        <tbody className={'d-flex w-100'}>
          <tr className={style.head}>
            <td>Comments</td>
            <td>Vote Count</td>
            <td>UpVote</td>
            <td>News Details</td>
          </tr>
          {news.map((item) => (
            <tr key={item.objectID}>
              <td>{item?.num_comments || 0}</td>
              <td>{item?.voteCount || 0}</td>
              <td
                onClick={() => dispatch(changeCount(item, news))}
                className={style.vote}
              >
                &#9650;
              </td>
              <td>
                {item.title
                  ? item.title
                  : item._highlightResult.story_text.value}{' '}
                <span className={style.by}>
                  <span className={style.grey}>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ({extractHostname(item.url)})
                      </a>
                    ) : (
                      ''
                    )}{' '}
                    by
                  </span>{' '}
                  {item.author}
                  <span className={style.grey}>
                    {' '}
                    {getTimeDiff(item.created_at)}
                  </span>
                  <span
                    className={style.clickable}
                    onClick={() => dispatch(hideItem(item.objectID, news))}
                  >
                    <span className={style.grey}>[</span>hide
                    <span className={style.grey}> ]</span>
                  </span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <>
        <div className={style.ctn}>
          <div className={style.mlauto}>
            <span className={style.clickable} onClick={() => pageChange(true)}>
              Previous
            </span>{' '}
            |
            <span className={style.clickable} onClick={() => pageChange(false)}>
              {' '}
              Next
            </span>
          </div>
        </div>
      </>
      <LineChart data={news} />
    </div>
  );
};
