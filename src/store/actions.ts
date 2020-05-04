import { Dispatch } from 'redux';
import { DispatchAction, ActionType } from './reducer';

export class RootDispatcher {
  private readonly dispatch: Dispatch<DispatchAction>;

  constructor(dispatch: Dispatch<DispatchAction>) {
    this.dispatch = dispatch;
  }

  getNews = (page: string | number) => {
    fetch(`http://hn.algolia.com/api/v1/search?page=${page || 0}`)
      .then((res) => res.json())
      .then((res) => {
        const hiddenItems = this.getHiddenItem();
        const hits = res.hits.filter(
          (hit: any) => hiddenItems.indexOf(hit.objectID) === -1
        );
        this.dispatch({ type: ActionType.UpdateNews, payload: hits });
      });
  };

  updateNews = (data: any) => {
    this.dispatch({ type: ActionType.UpdateNews, payload: data });
  };

  changeCount = (item: any, news: any) => {
    if (item.voteCount) {
      item.voteCount++;
    } else {
      item.voteCount = 1;
    }

    const i = news.findIndex((d: any) => d.objectID === item.objectID);

    const newData: any = [...news];
    newData[i] = item;
    this.updateNews(newData);
  };

  getHiddenItem = () => {
    const hl = localStorage.getItem('hiddenList');
    if (hl === null) {
      return [];
    } else {
      return JSON.parse(hl);
    }
  };

  hideItem = (id: string, news: any) => {
    const hide = this.getHiddenItem();
    hide.push(id);
    localStorage.setItem('hiddenList', JSON.stringify(hide));
    const i = news.findIndex((d: any) => d.objectID === id);
    const newData: any = [...news];
    newData.splice(i, 1);
    this.updateNews(newData);
  };
}
