var Cell = {
    create(x, y){
        var self = Object.create(Cell.prototype);
        self.x = x;
        self.y = y;
        self.state = false;
        self.nextState = false;
        return self;
    },
    prototype: {
        kill()     { this.state = false; },
        birth()    { this.state = true; },
        reverse()  { this.state = !this.state; },
        getState() { return this.state; }
    }
}

var CellMap = {
    create(mapSize){
        var self = Object.create(CellMap.prototype);
        self.cellArray = [[]];
        self.mapSize = mapSize;

        var x,y;
        for (x=0;x<self.mapSize;x++) {
            self.cellArray[x]=[];
            for (y=0;y<self.mapSize;y++) {
                self.cellArray[x][y] = Cell.create(x, y);
            }
        }
        return self;
    },
    prototype: {
        // �^����ꂽ���W���Z���}�b�v�����ǂ����𔻒�
        validateMapSize(x, y) {
            if(x<0) return false;
            if(y<0) return false;
            if(x>=this.mapSize) return false;
            if(y>=this.mapSize) return false;
            return true;
        },

        getCellState(x, y) {
            if(!this.validateMapSize(x,y)) return false;
            return this.cellArray[x][y].getState();
        },

        killCell(x, y)  { this.cellArray[x][y].state = false; },
        birthCell(x, y) { this.cellArray[x][y].state = true; },

        // �[�̏���
        exceedBoundary(x) {
            if(x<0) return this.mapSize-1 ;
            else if(x>=this.mapSize) return 0;
            else return x
        },

        // �Z�����W��^����Ƃ��̎��͂ɂ����������Ă���Z�������邩�Ԃ�
        countAroundAliveCell(x, y) {
            var count = 0;
            var curx,cury;

            var right_x = this.exceedBoundary(x+1);
            var left_x  = this.exceedBoundary(x-1);
            var up_y    = this.exceedBoundary(y-1);
            var down_y  = this.exceedBoundary(y+1);

            if (this.cellArray[left_x ][up_y  ].getState()) count++;
            if (this.cellArray[x      ][up_y  ].getState()) count++;
            if (this.cellArray[right_x][up_y  ].getState()) count++;
            if (this.cellArray[left_x ][y     ].getState()) count++;
            if (this.cellArray[right_x][y     ].getState()) count++;
            if (this.cellArray[left_x ][down_y].getState()) count++;
            if (this.cellArray[x      ][down_y].getState()) count++;
            if (this.cellArray[right_x][down_y].getState()) count++;
            return count;
        },

        // �Z���}�b�v���̎w�肵���Z���̎��̏�Ԃ����肷��
        decisionNextState(x, y) {
            var count = this.countAroundAliveCell(x,y);
            if (count == 3)
                this.cellArray[x][y].nextState = true;
            else if (count == 2)
                this.cellArray[x][y].nextState = this.cellArray[x][y].state;
            else
                this.cellArray[x][y].nextState = false;
        },

        // �w�肵���Z���̏�Ԃ𔽓]
        reverseState(x, y) { this.cellArray[x][y].reverse(); },

        // �S�ẴZ���̎��̏�Ԃ����肷��
        // �ڍs�͂܂����Ȃ�
        decisionNextGeneration() {
            var x,y;
            for (x=0;x<this.mapSize;x++) {
                for (y=0;y<this.mapSize;y++) {
                    this.decisionNextState(x,y);
                }
            }
        },

        // �S�ẴZ�������̏�ԂɈڍs������
        goToNextGeneration() {
            var x,y;
            for (x=0;x<this.mapSize;x++) {
                for (y=0;y<this.mapSize;y++) {
                    this.cellArray[x][y].state = this.cellArray[x][y].nextState;
                }
            }
        }
    }
}
