import axios from "axios";

const DashboardDataFetch = async (lastFetchedDate) => {
  try {
    const url = lastFetchedDate
      ? `apiDashboard/GetAllPostFromServices?lastFetchedDate=${lastFetchedDate}`
      : `apiDashboard/GetAllPostFromServices`;

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}${url}`
    );
    return response.data.message;
  } catch (error) {
    throw new error.message();
  }
};

const LikeSubmite = async (likeData) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}apiDashboard/InsertLike`,
      likeData
    );
    return response;
  } catch (error) {
    throw new error.message();
  }
};

const CommentAdd = async (commentData) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}apiDashboard/commentAdd`,
      commentData
    );
    return response;
  } catch (error) {
    throw new error.message();
  }
};

const PollUpdate = async (PollData) => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}apiDashboard/Updatepoll`,
      PollData
    );
    return response;
  } catch (error) {
    throw new error.message();
  }
};

const UploadPost = async (formData) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}apiDashboard/InsertPost`,
      formData
    );
    return response;
  } catch (error) {
    throw new error.message();
  }
};

const UploadPoll = async (formDataToSend) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}apiDashboard/InsertPost`,
      formDataToSend
    );
    return response;
  } catch (error) {
    throw new error.message();
  }
};
export {
  DashboardDataFetch,
  LikeSubmite,
  CommentAdd,
  PollUpdate,
  UploadPost,
  UploadPoll,
};
