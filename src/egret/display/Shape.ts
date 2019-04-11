//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


namespace egret {

    /**
     * This class is used to create lightweight shapes using the drawing application program interface (API). The Shape
     * class includes a graphics property, which lets you access methods from the Graphics class.
     * @see egret.Graphics
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Shape.ts
     * @language en_US
     */
    /**
     * 此类用于使用绘图应用程序编程接口 (API) 创建简单形状。Shape 类含有 graphics 属性，通过该属性您可以访问各种矢量绘图方法。
     * @see egret.Graphics
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Shape.ts
     * @language zh_CN
     */
    export class Shape extends DisplayObject {

        /**
         * Creates a new Shape object.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个 Shape 对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public constructor() {
            super();
            this.$graphics = new Graphics();
            this.$graphics.$setTarget(this);
        }

        protected createNativeDisplayObject(): void {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(egret_native.NativeObjectType.GRAPHICS);
        }

        /**
         * @private
         */
        $graphics:Graphics;

        /**
         * Specifies the Graphics object belonging to this Shape object, where vector drawing commands can occur.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取 Shape 中的 Graphics 对象。可通过此对象执行矢量绘图命令。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get graphics():Graphics {
            return this.$graphics;
        }

        /**
         * @private
         */
        $measureContentBounds(bounds:Rectangle):void {
            this.$graphics.$measureContentBounds(bounds);
        }

        $hitTest(stageX:number, stageY:number):DisplayObject {
            let target = super.$hitTest(stageX, stageY);
            if (target == this) {
                target = this.$graphics.$hitTest(stageX, stageY);
            }
            return target;
        }

        /**
         * @private
         */
        public $onRemoveFromStage():void {
            super.$onRemoveFromStage();
            if(this.$graphics) {
                this.$graphics.$onRemoveFromStage();
            }
        }

        public $graphicsOffetMatrix: egret.Matrix = new egret.Matrix(); //local matrix
        protected onUpdateTransform(parent: DisplayObject): void {
            //clear and set this.$graphicsOffetMatrix
            const wt = this.$worldTransform;
            const gt = this.$graphicsOffetMatrix;
            gt.identity();
            gt.setTo(wt.a, wt.b, wt.c, wt.d, wt.tx, wt.ty);
            //
            const node = this.graphics.$renderNode;
            if (node.x || node.y) {
                //需要做变换。用一个临时的矩阵
                const offsetMatrix = Matrix.create();
                offsetMatrix.identity();
                offsetMatrix.setTo(1, 0, 0, 1, node.x, node.y);
                //开始计算
                const a1 = gt.a;
                const b1 = gt.b;
                const c1 = gt.c;
                const d1 = gt.d;
                const tx1 = gt.tx;
                const ty1 = gt.ty;
                if (offsetMatrix.a !== 1 || offsetMatrix.b !== 0 || offsetMatrix.c !== 0 || offsetMatrix.d !== 1) {
                    gt.a = offsetMatrix.a * a1 + offsetMatrix.b * c1;
                    gt.b = offsetMatrix.a * b1 + offsetMatrix.b * d1;
                    gt.c = offsetMatrix.c * a1 + offsetMatrix.d * c1;
                    gt.d = offsetMatrix.c * b1 + offsetMatrix.d * d1;
                }
                gt.tx = offsetMatrix.tx * a1 + offsetMatrix.ty * c1 + tx1;
                gt.ty = offsetMatrix.tx * b1 + offsetMatrix.ty * d1 + ty1;
                ///还原回去
                Matrix.release(offsetMatrix);
            }
        }
    }

}