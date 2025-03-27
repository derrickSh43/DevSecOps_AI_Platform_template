#!/bin/bash
TASK_NUM=$1
DIR="/home/labuser/python_lab"

case $TASK_NUM in
  [... Tasks 1-25 unchanged ...]
  "quiz1")
    if [ -f "$DIR/quiz1_score.txt" ] && [ -s "$DIR/quiz1_score.txt" ]; then
      SCORE=$(cat "$DIR/quiz1_score.txt")
      echo "Quiz 1 Passed! Score: $SCORE/2"
    else
      echo "Quiz 1 Failed: Run quiz1.py and answer questions."
    fi
    ;;
  "quiz2")
    if [ -f "$DIR/quiz2_score.txt" ] && [ -s "$DIR/quiz2_score.txt" ]; then
      SCORE=$(cat "$DIR/quiz2_score.txt")
      echo "Quiz 2 Passed! Score: $SCORE/3"
    else
      echo "Quiz 2 Failed: Run quiz2.py and answer questions."
    fi
    ;;
  "quiz3")
    if [ -f "$DIR/quiz3_score.txt" ] && [ -s "$DIR/quiz3_score.txt" ]; then
      SCORE=$(cat "$DIR/quiz3_score.txt")
      echo "Quiz 3 Passed! Score: $SCORE/3"
    else
      echo "Quiz 3 Failed: Run quiz3.py and answer questions."
    fi
    ;;
  *)
    echo "Task $TASK_NUM not recognized."
    ;;
esac