import json
from scoring.module import ScoreModule

class LanguageWidget(ScoreModule):
    def get_legend_value(self, id):
        legend = self.qset["options"]["legend"]

        for item in legend:
            if id == item["id"]:
                return item["name"]
            
        return ""
    
    def check_answer(self, log):
        q = self.get_question_by_item_id(log.item_id)
        if q:
            response = json.loads(log.text)

            answer = []

            for token in q["answers"][0]["options"]["phrase"]:
                answer.append({
                    "value": token["value"],
                    "legend": self.get_legend_value(token["legend"])
                })

            if len(answer) != len(response):
                return 0
            
            for index, token in enumerate(answer):
                if index >= len(response):
                    return 0

                if q["options"]["displayPref"] == "word":
                    if response[index]["value"] != token["value"] or response[index]["legend"] != token["legend"]:
                        return 0
                else:
                    if response[index]["legend"] != token["legend"]:
                        return 0
                    
            return 100
        
        return 0

    def details_for_question_answered(self, log):
        q = self.get_question_by_item_id(log.item_id)
        score = self.check_answer(log)

        return {
            "data": [
                self.get_ss_question(log, q),
                q["id"],
                self.get_ss_answer(log, q),
                self.get_ss_expected_answers(log, q)
            ],
            "data_style": ["question", "question_id", "response", "answer"],
            "score": score,
            "feedback": self.get_feedback(log, q["answers"]),
            "type": log.log_type,
            "style": self.get_detail_style(score),
            "tag": "div",
            "symbol": "%",
            "graphic": "score",
            "display_score": True
        }
