const { token } = localStorage;

const fetchData = async (url, method, data = undefined) => {
  try {
    let response = await fetch(url, {
      method,
      headers: new Headers({
        'content-Type': 'application/json',
        Authorization: token,
      }),
      body: JSON.stringify(data),
    });
    response = await response.json();
    return response;
  } catch (err) {
    console.log(err);
  }
};

const baseUrl = 'http://localhost:3000/api/v2';
