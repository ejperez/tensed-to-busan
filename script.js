$(function () {
  const questionsWithAnswers = [
    [
      "Simple Past",
      "The doctor (say) <> that Tom was too sick to go to work.",
      "said",
    ],
    [
      "Simple Past",
      "I called you last night after dinner, but you (be, not) <> there.",
      "were not",
    ],
    [
      "Simple Present",
      "Every Monday, Sally (drive) <> her kids to football practice. ",
      "drives",
    ],
    [
      "Simple Present",
      "This delicious chocolate (be) <> made by a small chocolatier in Zurich, Switzerland.",
      "is",
    ],
    [
      "Simple Future",
      "They (cook) <> dinner tomorrow for Thanksgiving.",
      "will cook",
    ],
    ["Simple Future", "I (learn) <> a new language.", "will learn"],
    [
      "Past Perfect",
      "I (eat, already) <> when they arrived.",
      "had already eaten",
    ],
    ["Present Perfect", "I (see) <> that movie twenty times", "have seen"],
    [
      "Future Perfect",
      "By the time the troops arrive, the combat group (spend) <> several weeks waiting.",
      "will have spent",
    ],
    [
      "Past Progressive",
      "The explorer (explain) <> the lastest discovery in Egypt when protests began on the streets.",
      "was explaining",
    ],
    [
      "Present Progressive",
      "I hate living in Seattle because it (rain, always) <>.",
      "is always raining",
    ],
    [
      "Future Progressive",
      "We (go) <> to the gym after work.",
      "will be going",
    ],
    [
      "Past Perfect Progressive",
      "We (walk) <> for only 5 minutes when the rain started.",
      "had been walking",
    ],
    [
      "Present Perfect Progressive",
      "We (wait) <> here for over half an hour and nobody has taken our order yet. ",
      "have been waiting",
    ],
    [
      "Future Perfect Progressive",
      "By the end of this month, she (work) <> long enough to get benefits.",
      "will have been working",
    ],
  ];

  // Screens
  var $screen = $("#screen");
  var $finish = $("#finish");
  var $story = $("#story");
  var $main = $("#main");
  var $win = $("#win");
  var $lose = $("#lose");
  var $fist = $("#fist");
  var $blood = $("#blood");

  var $runBox = $("#runBox");
  var $question = $("#question");
  var $answerForm = $("#answerForm");
  var $runButton = $("#runButton");
  var currentZoom = 100;
  var zoomIncrement = 10;
  var currentQuestionIndex = 0;

  $screen.hide();
  $screen.hide();
  $finish.hide();
  $story.hide();
  $win.hide();
  $lose.hide();

  var win = function (callback) {
    $fist.css({ left: "0px", bottom: "0px" });
    $win.find(".zombieBig").css({ width: "100%", height: "1500px" });

    $win.fadeIn(100, function () {
      $screen.fadeOut(100, function () {
        $fist.animate({ left: "200px", bottom: "100px" }, 200, function () {
          $win
            .find(".zombieBig")
            .animate({ width: "0px", height: "0px" }, 500, function () {
              $win.fadeOut(100, function () {
                $screen.fadeIn(100, callback);
              });
            });
        });
      });
    });
  };

  var lose = function (callback) {
    $lose.find(".zombieBig").css({ backgroundSize: "100%" });
    $blood.hide();

    $lose.fadeIn(100, function () {
      $lose
        .find(".zombieBig")
        .animate({ backgroundSize: "120%" }, 100, function () {
          $blood.show();
          $lose.fadeOut(1000, callback);
        });
    });
  };

  $("#startButton").click(function (e) {
    e.preventDefault();

    $main.fadeOut(1000, function () {
      $story.fadeIn();
    });
  });

  $("#storyButton").click(function (e) {
    e.preventDefault();

    $story.fadeOut(1000, function () {
      $screen.fadeIn(function () {
        $runButton.hide();
        runShowQuestion(questionsWithAnswers[currentQuestionIndex]);
      });
    });
  });

  var runShowQuestion = function ([title, question]) {
    currentZoom += zoomIncrement;
    $screen.animate(
      {
        backgroundSize: currentZoom + "%",
      },
      1000,
      function () {
        $runBox.fadeOut(0, function () {
          $question.fadeIn();
          $question
            .find("#currentQuestion")
            .html(
              question.replace(
                "<>",
                '<input type="text" name="answer" autocomplete="off"/>',
              ),
            );
          $question.find("#currentTitle").html(title + " Tense");
          $runButton.show();
          $question.find("#currentQuestion input").focus();
        });
      },
    );
  };

  $answerForm.submit(function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { answer } = Object.fromEntries(formData.entries());
    const isLast = currentQuestionIndex === questionsWithAnswers.length - 1;
    const correctAnswer = questionsWithAnswers[currentQuestionIndex][2];
    const isCorrect =
      answer.toLowerCase().trim() === correctAnswer.toLowerCase();

    if (isCorrect) {
      $question.fadeOut(
        100,
        win(function () {
          if (isLast) {
            $screen.fadeOut(2000, function () {
              $finish.fadeIn();
            });
            return;
          }

          runShowQuestion(questionsWithAnswers[++currentQuestionIndex]);
        }),
      );
    } else {
      $question.fadeOut(
        100,
        lose(function () {
          $question.fadeIn(100);
        }),
      );
    }
  });

  $runButton.click(function (e) {
    e.preventDefault();
    $runButton.hide();
    runShowQuestion(questionsWithAnswers[currentQuestionIndex]);
  });
});
