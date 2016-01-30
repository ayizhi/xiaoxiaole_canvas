/**
 * Created by Danny on 2015/9/9 15:46.
 */
(function () {
    //��̬��Դ�����࣬��������ڼ������еľ�̬ͼƬ�����֡�
    window.StaticResoucesUtil = Class.extend({
        init: function () {
            this.images = {};
        },
        //��ȡͼƬ
        //����loadImages������������
        //��һ����JSON����ʾ��ȡ���б�
        //�ڶ����ǻص��������ص������ֽ���3���������Ѿ����ص���������������ͼƬ����
        loadImages: function (jsonURL, callback) {
            //����this
            var self = this;
            //��Ҫȥ��ȡjson�ļ�����ʲô����Ajax������
            var xhr = new XMLHttpRequest();
            //Ajax������
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                        //�Ѿ����غõ�ͼƬ����
                        var alreayLoadNumber = 0;
                        //��json�ļ�����Ĵ��ı���תΪjson����
                        var jsonObj = JSON.parse(xhr.responseText);
                        //ѭ����䣬ȥ������ÿ��ͼƬ��������
                        for (var i = 0; i < jsonObj.images.length; i++) {
                            // ����һ��ͼƬ
                            var image = new Image();
                            // һ������src���ԣ����󷢳�
                            image.src = jsonObj.images[i].src;
                            // ���
                            image.index = i;
                            image.onload = function () {
                                //���Ѿ����غõ�ͼƬ������1
                                alreayLoadNumber++;
                                //�������Լ���images������
                                self.images[jsonObj.images[this.index].name] = this;
                                //�ص��������ĺ���
                                callback(alreayLoadNumber, jsonObj.images.length, self.images);
                            }
                        }
                    }
                }
            }
            xhr.open("get", jsonURL, true);
            xhr.send(null);
        }
    });
})();