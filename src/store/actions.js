import axios from 'axios';

const StorageConstants = {
  HIDDENITEMS: 'hiddenList',
  VOTECOUNT: 'voteCount',
};

export const getNews = (page) => async (dispatch) => {
  const response = await axios.get(
    `https://hn.algolia.com/api/v1/search?page=${page || 0}`
  );
  const res = await getHits(response.data);

  dispatch({ type: 'UpdateNews', payload: res });
};

export const getHits = async (res) => {
  const hiddenItems = getHiddenItem();
  const voteCount = getStoredVoteCount();
  // const hits = [];
  return Promise.all(
    res.hits.map((hit) => {
      if (hiddenItems.indexOf(hit.objectID) === -1) {
        const i = voteCount.findIndex((v) => v.objectID === hit.objectID);
        if (i === -1) {
          hit.voteCount = 0;
        } else {
          hit.voteCount = voteCount[i].voteCount;
        }
        return hit;
      }
    })
  );
};

export const updateNews = (data) => {
  return { type: 'UpdateNews', payload: data };
};

export const changeCount = (item, news) => {
  item.voteCount++;
  const votes = getStoredVoteCount();
  const vi = votes.findIndex((v) => v.objectID === item.objectID);
  if (vi === -1) {
    votes.push({ objectID: item.objectID, voteCount: item.voteCount });
  } else {
    votes[vi].voteCount = item.voteCount;
  }
  localStorage.setItem(StorageConstants.VOTECOUNT, JSON.stringify(votes));

  const i = news.findIndex((d) => d.objectID === item.objectID);

  const newData = [...news];
  newData[i] = item;
  updateNews(newData);
};

export const getHiddenItem = () => {
  if (typeof localStorage !== 'undefined') {
    const hl = localStorage.getItem(StorageConstants.HIDDENITEMS);
    if (hl === null) {
      return [];
    } else {
      return JSON.parse(hl);
    }
  } else {
    return [];
  }
};

export const getStoredVoteCount = () => {
  if (typeof localStorage !== 'undefined') {
    const vc = localStorage.getItem(StorageConstants.VOTECOUNT);
    if (vc === null) {
      return [];
    } else {
      return JSON.parse(vc);
    }
  } else {
    return [];
  }
};

export const hideItem = (id, news) => {
  const hide = getHiddenItem();
  hide.push(id);
  localStorage.setItem(StorageConstants.HIDDENITEMS, JSON.stringify(hide));
  const i = news.findIndex((d) => d.objectID === id);
  const newData = [...news];
  newData.splice(i, 1);
  updateNews(newData);
};
