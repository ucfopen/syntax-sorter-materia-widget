<?php

namespace Materia;

class Score_Modules_LanguageWidget extends Score_Module{

	public function check_answer($log)
	{
		if (isset($this->questions[$log->item_id]))
		{
		// 	foreach ($this->questions[$log->item_id]->answers as $answer)
		// 	{
        //         // if ($log->text == $a)
		// 		// if ($use_answer_text)
		// 		// {
		// 		// 	if ($log->text == $answer['text']) return $answer['value'];
		// 		// }
		// 		// else
		// 		// {
		// 		// 	if ($log->text == $answer['id']) return $answer['value'];
		// 		// }
		// 	}
		// }

		return 100;
	}

	// public function get_ss_answer($log, $question)
	// {
	// 	return $this->inst->qset->version < 2 ? $log->text : $log->value;
	// }
}
