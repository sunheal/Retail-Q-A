CREATE INDEX product_id_index ON qa.questions USING HASH(product_id);

CREATE INDEX question_id_index ON qa.answers USING HASH(question_id);

CREATE INDEX answer_id_index ON qa.answers_photos USING HASH(answer_id);