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

			$answer = [];

			foreach ($this->questions[$log->item_id]->answers[0]['options']['phrase'] as $token) {
				$answer[] = [
					'value' => $token['value'],
					'legend' => $this->getLegendValue($token['legend'])
				];
			}

			$max = count($answer);

			foreach ($answer as $index => $token) {

				if (array_key_exists($index, $response)) return 0;

				if ($this->questions[$log->item_id]->options['displayPref'] == 'word') {
					if (strcmp($response[$index]->value, $token['value']) != 0 || strcmp($response[$index]->legend, $token['legend']) != 0) {
						return 0;
					}
				}
				else
				{
					if (strcmp($response[$index]->legend, $token['legend']) != 0) {
						return 0;
					}
				}
			}

			return 100;
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
}
