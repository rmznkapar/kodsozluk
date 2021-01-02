document.addEventListener('DOMContentLoaded', () => {
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {
        const target = el.dataset.target;
        const $target = document.getElementById(target);
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
});

// const getTitles = (query) => {
//   const data = { query };
//   return new Promise((resolve, reject) => {
//     fetch('/search', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     })
//     .then(response => response.json())
//     .then(data => {
//       resolve(data);
//     })
//     .catch((error) => {
//       reject(error);
//     });
//   })
// }

// const searchInputEl = document.getElementById('search-input');

// searchInputEl.addEventListener('change', () => {
//   const inputText = searchInputEl.value
//   if (inputText.length > 3 ) {
//     getTitles(inputText).then((res) => {
//       console.log(res);
//     });
//   }
// });

const vote = async (entryId, rate) => {
  var response = await fetch('/vote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({entryId, rate}),
  });
  response = await response.text();
  return response;
}

const voteGroupEl = document.getElementsByClassName('vote-group');

Array.from(voteGroupEl).forEach((element) => {

  const activeVote = parseInt(element.attributes['data-active'].value);
  console.log(activeVote);
  if (activeVote === 1) {
    element.children[0].classList.add('active');
  } else if (activeVote === -1) {
    element.children[2].classList.add('active');
  }

  element.addEventListener('click', (e) => {
    const attrs = e.target.attributes;
    const voteRateEl = e.target.parentElement.children[1];
    if (e.target.classList.contains('active')) {
      e.target.classList.remove('active');
    } else {
      e.target.parentElement.children[0].classList.remove('active');
      e.target.parentElement.children[2].classList.remove('active');
      e.target.classList.add('active');
    }
    vote(attrs['data-id'].value, attrs['data-rate'].value).then((voteRate) => {
      voteRateEl.innerHTML = voteRate;
    });
  });
});