import { Dispatch } from 'redux';
import { DispatchAction, ActionType } from './reducer';

export enum StorageConstants {
  HIDDENITEMS = 'hiddenList',
  VOTECOUNT = 'voteCount',
}

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
        const voteCount = this.getStoredVoteCount();

        const hits: any = [];
        res.hits.map((hit: any) => {
          if (hiddenItems.indexOf(hit.objectID) === -1) {
            const i = voteCount.findIndex(
              (v: any) => v.objectID === hit.objectID
            );
            if (i === -1) {
              hit.voteCount = 0;
            } else {
              hit.voteCount = voteCount[i].voteCount;
            }
            hits.push(hit);
          }
        });
        this.dispatch({ type: ActionType.UpdateNews, payload: hits });
      });
  };

  updateNews = (data: any) => {
    this.dispatch({ type: ActionType.UpdateNews, payload: data });
  };

  changeCount = (item: any, news: any) => {
    item.voteCount++;
    const votes = this.getStoredVoteCount();
    const vi = votes.findIndex((v: any) => v.objectID === item.objectID);
    if (vi === -1) {
      votes.push({ objectID: item.objectID, voteCount: item.voteCount });
    } else {
      votes[vi].voteCount = item.voteCount;
    }
    localStorage.setItem(StorageConstants.VOTECOUNT, JSON.stringify(votes));

    const i = news.findIndex((d: any) => d.objectID === item.objectID);

    const newData: any = [...news];
    newData[i] = item;
    this.updateNews(newData);
  };

  getHiddenItem = () => {
    const hl = localStorage.getItem(StorageConstants.HIDDENITEMS);
    if (hl === null) {
      return [];
    } else {
      return JSON.parse(hl);
    }
  };

  getStoredVoteCount = () => {
    const vc = localStorage.getItem(StorageConstants.VOTECOUNT);
    if (vc === null) {
      return [];
    } else {
      return JSON.parse(vc);
    }
  };

  hideItem = (id: string, news: any) => {
    const hide = this.getHiddenItem();
    hide.push(id);
    localStorage.setItem(StorageConstants.HIDDENITEMS, JSON.stringify(hide));
    const i = news.findIndex((d: any) => d.objectID === id);
    const newData: any = [...news];
    newData.splice(i, 1);
    this.updateNews(newData);
  };
}
