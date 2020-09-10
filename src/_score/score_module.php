<?php

namespace Materia;

class Score_Modules_LanguageWidget extends Score_Module {

	public function getLegendValue($id) {
		$legend = $this->inst->qset->data['options']['legend'];

		foreach ($legend as $item) {
			if ($id == $item['id']) return $item['name'];
		}
		return '';
	}

	public function check_answer($log)
	{
		if (isset($this->questions[$log->item_id]))
		{
			$response = json_decode($log->text);
			$respNoFake = [];

			$answer = [];

			foreach ($this->questions[$log->item_id]->answers[0]['options']['phrase'] as $token) {

				$answer[] = [
					'value' => $token['value'],
					'legend' => $this->getLegendValue($token['legend'])
				];
			}

			$max = count($answer);
			$correct = 0;
			$leadTrailFakes = 0;
			$firstReal = -1;
			$lastReal = -1;

			// Gets the indeces of the 1st and last real token
			for ($i = 0; $i < count($response); $i++)
			{
				$isFake = TRUE;

				foreach ($answer as $goodToken) {
					
					if ($this->questions[$log->item_id]->options['displayPref'] == 'word') {
						// verify WORD and LEGEND
						if (strcmp($response[$i]->value, $goodToken['value']) == 0 && strcmp($response[$i]->legend, $goodToken['legend']) == 0) {
							$isFake = FALSE;
							break;
						}
					}
					else {
						// just verify LEGEND
						if (strcmp($response[$i]->legend, $goodToken['legend']) == 0) {
							$isFake = FALSE;
							break;
						}
					}
					
				}

				if ($isFake == FALSE)
				{
					if ($firstReal == -1) {
						$firstReal = $i;
					}
					$lastReal = $i;
				}
			}

			// There are no real tokens
			if ($firstReal == -1)
				return 0;
			
			trace("FIRST REAL: ".$firstReal);
				

			// Gets the number of leading and trailing fakes
			$leadTrailFakes = (count($response) - 1) - ($lastReal - $firstReal);

			// Gets the response with no leading and trailing fakes
			for ($i = $firstReal; $i <= $lastReal; $i++)
			{
				array_push($respNoFake, $response[$i]);
			}

			trace("ALL REAL TOKENS: ");
			trace($respNoFake);

			// Tells if their answer has correct tokens
			for ($i = 0; $i < count($answer) && $i < count($respNoFake); $i++)
			{
				if ($this->questions[$log->item_id]->options['displayPref'] == 'word') {

					trace("Comparing ANSWER ".$answer[$i]['value']." TO RESPONSE ".$respNoFake[$i]->value);
					trace("COMPARING ANSWER LEGEND ".$answer[$i]['legend']." TO RESPONSE ".$respNoFake[$i]->legend);
					
					if (strcmp($answer[$i]['value'], $respNoFake[$i]->value) == 0 && strcmp($answer[$i]['legend'], $respNoFake[$i]->legend) == 0) {
						$correct++;
					}
				}
				else {
					if (strcmp($answer[$i]['legend'], $respNoFake[$i]->legend) == 0) {
						$correct++;
					}
				}
			}
			
			trace("FOUND ".$correct." ANSWERS out of ".$max);

			// Calculates the final score
			$score = ($correct / $max) - (.1 * $leadTrailFakes);

			if ($score < 0)
			{
				$score = 0;
			}

			return $score * 100;
		}
	}

	protected function details_for_question_answered($log)
	{
		$q     = $this->questions[$log->item_id];
		$score = $this->check_answer($log);

		return [
			'data' => [
				$this->get_ss_question($log, $q),
				$q->id,
				$this->get_ss_answer($log, $q),
				$this->get_ss_expected_answers($log, $q)
			],
			'data_style'    => ['question', 'question_id', 'response', 'answer'],
			'score'         => $score,
			'feedback'      => $this->get_feedback($log, $q->answers),
			'type'          => $log->type,
			'style'         => $this->get_detail_style($score),
			'tag'           => 'div',
			'symbol'        => '%',
			'graphic'       => 'score',
			'display_score' => true
		];
	}

	// public function get_ss_answer($log, $question)
	// {
	// 	return $this->inst->qset->version < 2 ? $log->text : $log->value;
	// }
}
