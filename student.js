const { log } = console;

const getCoach = async () => {
  try {
    const options = {
      url,
    };
    const coaches = await $.ajax(options);
    listCoach = coaches;
    addCoachesToLocalStorage(coaches);
    return {
      isError: false,
      coaches,
    };
  } catch (error) {
    return {
      isError: true,
      coaches: [],
    };
  }
};

// Initialize Coach
getCoach().then(({ coaches }) => {
  log("New coaches loaded!!: ", coaches);
  renderCoachProfiles(coaches);
});

const getCoachById = async (id) => {
  try {
    const options = {
      url: `${url}?id=${id}`
    };
    const coach = await $.ajax(options);
    return {
      isError: false,
      coach,
    };
  } catch (error) {
    return {
      isError: true,
      coach: [],
    };
  }
};

const displayCoachExperience = (experiences) => {
  const result = experiences.map((experience) => {
    return `
            <li>${experience}</li>
        `;
  });

  return result;
};

const modalTemplate = (coach) => {
  const {
    fullName,
    profilePictureUrl,
    country,
    experiences,
    hubspotCalendarUrl,
  } = coach;

  const modalFooter = `
        <a href="${hubspotCalendarUrl}" target="_blank" class="modal-close waves-effect waves-green btn">
          Schedule
        </a>
    `;

  const fullNameEl = $('<h4>').text(fullName);
  const profileImgEl = $('<img>').attr('src', profilePictureUrl);
  const countryEl = $(`<p><b>Country: </b> ${country}</p>`);
  const experiencesList = $('<ul></ul>');

  experiences.map((experience) => {
    const currentList = $('<li>').text(experience);
    currentList.css({
      'list-style-type': 'initial',
      'margin-left': '25px'
    })
    experiencesList.append(currentList);
  });

  const experienceTitle = $('<b>Experiences: </b>');


  const modalContent = $('<div>');
        modalContent.append(fullNameEl);
        modalContent.append(profileImgEl);
        modalContent.append(countryEl);
        // modalContent.append(experienceTitle);
        // modalContent.append(experiencesList);
  return {
    modalFooter,
    modalContent,
  };
};

const profileTemplate = (coach) => {
  const { _id, fullName, profilePictureUrl, country, hubspotCalendarUrl } =
    coach;
  return `
        <li class="collection-item avatar">
            <div data-target="coach-modal" class="profile-card modal-trigger" data-id="${_id}">
                <img src="${profilePictureUrl}" alt="" class="circle">
                <span class="title">${fullName}</span>
                <p>${country}<br>
                </p>
            </div>
            <a href="${hubspotCalendarUrl}" target="_blank" class="secondary-content"><i class="material-icons">schedule</i></a>
        </li>
    `;
};

const renderCoachProfiles = (coaches) => {
  const result = coaches.map((coach) => {
    return `
            <ul class="collection">
                ${profileTemplate(coach)}
            </ul>
        `;
  });

  $(".home").append(result);
  return result;
};

$(document).on("click", ".profile-card", async function () {
  const coachId = $(this).attr("data-id");
  const { coach } = await getCoachById(coachId);

  const { modalContent, modalFooter } = modalTemplate(coach);
  $(".modal-content").html(modalContent);
  $(".modal-footer").html(modalFooter);
});

$(document).ready(function () {
  $(".modal").modal();
});