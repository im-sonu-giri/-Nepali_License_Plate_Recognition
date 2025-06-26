import os
from datetime import datetime

from mltu.configs import BaseModelConfigs

class ModelConfiguration(BaseModelConfigs):
    def __init__(self):
        super().__init__()
        self.model_path = os.path.join("Models/OCR", datetime.strftime(datetime.now(), "%Y%m%d%H%M"))
        self.vocab = "०१२३४५६७८९अआइईउऊऋॠएऐओऔअंअःअँकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहळक्षज्ञ्ािीुूृेैोौंःँ"
        self.height = 32
        self.width = 128
        self.max_text_length = 23
        self.batch_size = 256
        self.learning_rate = 1e-4
        self.train_epochs = 50
        self.train_workers = 8

