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
			$response = explode(',',$log->text);

			$answer = [];

			foreach ($this->questions[$log->item_id]->answers[0]['options']['phrase'] as $token) {
				if ($this->questions[$log->item_id]->options['displayPref'] == 'word') {
					array_push($answer, $token['value']);
				}
				else {
					array_push($answer, $this->getLegendValue($token['legend']));
				}
			}

			$max = count($answer);
			$correct = 0;

			foreach ($answer as $index => $token) {
				if (strcmp($token, $response[$index]) == 0) {
					$correct++;
				}
			}

			return ($correct / $max) * 100;
		}
	}

	// public function get_ss_answer($log, $question)
	// {
	// 	return $this->inst->qset->version < 2 ? $log->text : $log->value;
	// }
}
