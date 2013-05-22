(function ( $ ) {
    $.fn.dragAndDraw = function(options) {
        
        var $settings = $.extend({
            grid : false,
            top : null,
            left : null,
            width : null,
            height : null,
            start: null,
            stop: null,
            class: null
        }, options );
        
        var $drawing = false;
        var $drawSpace = this;
        var $origin = [];
        var $current = [];
        var $fakeDiv = null;
        
        // Functions
        
        var createFakeDiv = function(){
            $fakeDiv = $("<div/>").appendTo($drawSpace).css({
                "left" : $origin["x"],
                "top" : $origin["y"]
            }).addClass("draw-temporary");
            if($settings.class !== null)
                $fakeDiv.addClass($settings.class);
            if($settings.content !== null)
                $fakeDiv.html($settings.content);
        }
        
        var gridPosition = function($positions){
            if($settings.grid){
                $x = $positions.pageX;
                $y = $positions.pageY;
                $x = Math.round($x/$settings.grid[0]) * $settings.grid[0];
                $y = Math.round($y/$settings.grid[0]) * $settings.grid[0];
                return {"pageX" : $x, "pageY" : $y};
            }
            return $positions;
        }
        
        var setOrigin = function(e){
            $position = gridPosition(e);
            
            if($settings.top !== null)
                $origin["y"] = $settings.top;
            else
                $origin["y"] = $position.pageY;
            if($settings.left !== null)
                $origin["x"] = $settings.left;
            else
                $origin["x"] = $position.pageX;
        }
        
        var setCurrent = function(e){
            $position = gridPosition(e);
            
            if($settings.height !== null)
                $current["y"] = $origin["y"] + $settings.height;
            else
                $current["y"] = $position.pageY;
            
            if($settings.width !== null)
                $current["x"] = $origin["x"] + $settings.width;
            else
                $current["x"] = $position.pageX;
            
        }
        
        var updateFakeDiv = function(){
            $fakeDiv.css({
                "width" : $current["x"] - $origin["x"],
                "height" : $current["y"] - $origin["y"]
            })
        }
        
        // Triggers
        
        $(document).on("mousemove", function(e){
            if($drawing){
                setCurrent(e);
                updateFakeDiv();
            }
        });
        this.on("mousedown", function(e){
            $drawing = true;
            setOrigin(e);
            createFakeDiv();
            if($settings.start !== null)
                $settings.start($(this), $fakeDiv);
        });
        this.on("mouseup", function(){
            $drawing = false;
            $fakeDiv.removeClass("draw-temporary");
            if($settings.stop !== null)
            $settings.stop($(this), $fakeDiv);
        });
        return this;
    };
}( jQuery ));