import React from 'react';
import style from './home.module.scss';
import { useLocation, useHistory } from 'react-router-dom';
import { LineChart } from './components/LineChart/LineChart';
import { useDispatch, useSelector } from 'react-redux';
import { RootDispatcher } from '../../store/actions';
import { InitialState } from '../../store/reducer';

interface HomeProps {}

interface StateProps {
    news: any;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const Home: React.FC<HomeProps> = (props) => {
  const query = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const rootDispatcher = new RootDispatcher(dispatch);
  const {news} = useSelector<InitialState, StateProps>((state: InitialState) => {
    return {
       news: state.news
    }
});

  const pageChange = (prev: boolean) => {
    const page = (Number(query.get('page')) || 0) + (prev ? -1 : 1);
    history.push(`${window.location.pathname}?page=${page !== -1 ? page : 0}`);
  };

  const getTimeDiff = (date: any) => {
    const now: any = new Date();
    const date1: any = new Date(date);
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

  const extractHostname = (url: string) => {
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
    rootDispatcher.getNews(Number(query.get('page')) || 0);
  }, [query.get('page')]);

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
          {news.map((item: any) => (
            <tr key={item.objectID}>
              <td>{item?.num_comments || 0}</td>
              <td>{item?.voteCount || 0}</td>
              <td onClick={() => rootDispatcher.changeCount(item, news)} className={style.vote}>
                &#9650;
              </td>
              <td>
                {item.title
                  ? item.title
                  : item._highlightResult.story_text.value}{' '}
                <span className={style.by}>
                  <span className={style.grey}>
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
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
                    onClick={() => rootDispatcher.hideItem(item.objectID, news)}
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
      <div className={style.dflex}>
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
      <LineChart data={news} />
    </div>
  );
};
