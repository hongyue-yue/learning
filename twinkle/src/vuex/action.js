export const newsFeedPush=({dispatch},arr)=>{
  dispatch('NEWSFEED_PUSH', arr)
}
export const newsFeedUnshift=({dispatch},arr)=>{
  dispatch('NEWSFEED_UNSHIFT',arr)
}
export const userPush=({dispatch},obj)=>{
  dispatch('USER_PUSH',obj)
}
export const dynamicFeedPush=({dispatch},arr)=>{
  dispatch('DYNAMICFEED_PUSH',arr)
}
export const storyFeedPush=({dispatch},arr)=>{
  dispatch('STORYFEED_PUSH',arr)
}
export const newsCommentsUnshift=({dispatch}, id, obj)=>{
  dispatch('NEWSCOMMENTS_UNSHIFT', id, obj)
}
export const dynamicCommentsUnshift=({dispatch}, id, obj)=>{
  dispatch('DYNAMICCOMMENTS_UNSHIFT', id, obj)
}
