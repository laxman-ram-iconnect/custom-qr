from __future__ import print_function
import numpy as np
import cv2
import sys


# load the image on disk and then display it
image = cv2.imread("./public/" + sys.argv[1])
cv2.imshow("Original", image)

# convert the color image into grayscale
grayScale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Find edges in the image using canny edge detection method
# Calculate lower threshold and upper threshold using sigma = 0.33
sigma = 0.33
v = np.median(grayScale)
low = int(max(0, (1.0 - sigma) * v))
high = int(min(255, (1.0 + sigma) * v))

edged = cv2.Canny(grayScale, low, high)

# After finding edges we have to find contours
# Contour is a curve of points with no gaps in the curve
# It will help us to find location of shapes

# cv2.RETR_EXTERNAL is passed to find the outermost contours (because we want to outline the shapes)
# cv2.CHAIN_APPROX_SIMPLE is removing redundant points along a line
(_, cnts, _) = cv2.findContours(edged,
                                cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)


'''
We are going to use contour approximation method to find vertices of
geometric shapes. The alogrithm  is also known as Ramer Douglas Peucker alogrithm.
In OpenCV it is implemented in cv2.approxPolyDP method.abs
detectShape() function below takes a contour as parameter and
then returns its shape
 '''


def detectShape(cnt):
    shape = 'unknown'

    # calculate perimeter using
    peri = cv2.arcLength(c, True)
    #print(peri)
    
    # apply contour approximation and store the result in vertices
    vertices = cv2.approxPolyDP(c, 0.04 * peri, True)
    x, y, width, height = cv2.boundingRect(vertices)


    # If the shape it triangle, it will have 3 vertices
    if len(vertices) == 3:
        shape = 'triangle'
        #print(shape)
    # if the shape has 4 vertices, it is either a square or
    # a rectangle
    elif len(vertices) == 4:
        # using the boundingRect method calculate the width and height
        # of enclosing rectange and then calculte aspect ratio

        aspectRatio = float(width) / height

        # a square will have an aspect ratio that is approximately
        # equal to one, otherwise, the shape is a rectangle
        if aspectRatio >= 0.95 and aspectRatio <= 1.05:
            shape = "square"
            #print(shape)

        else:
            shape = "rectangle"
            #print(shape)

    # if the shape is a pentagon, it will have 5 vertices
    elif len(vertices) == 5:
        shape = "pentagon"
        #print(shape)

    # otherwise, we assume the shape is a circle
    else:
        shape = "circle"
        #print(shape)
    # return the name of the shape
    return { "shape": shape, "x": x }
    
legend = {
    "circle": 1,
    "triangle": 2,
    "square": 3,
    "rectangle": 4,
    "pentagon": 5
}

# Now we will loop over every contour
# call detectShape() for it and
# write the name of shape in the center of image
result=[]

# loop over the contours
for c in cnts:
    # compute the moment of contour
    M = cv2.moments(c)
    # From moment we can calculte area, centroid etc
    # The center or centroid can be calculated as follows
    if M["m00"] != 0:
        cX = int(M['m10'] / M['m00'])
        cY = int(M['m01'] / M['m00'])
    
    else:
        # set values as what you need in the situation
        cX, cY = 0, 0


    # call detectShape for contour c

    ShapeWithX = detectShape(c)
    #print(ShapeWithX)
    shape = ShapeWithX['shape']
    x = ShapeWithX['x']
    res = legend[shape]
    result.append({ 'x': x, 'res': res})

    # Outline the contours
    cv2.drawContours(image, [c], -1, (0, 255, 0), 2)

    # Write the name of shape on the center of shapes
    
    cv2.putText(image, shape, (cX, cY), cv2.FONT_HERSHEY_DUPLEX,
                0.5, (255, 255, 255), 2)


    # show the output image
    #cv2.imshow("Image", image)

def sortByX(val):
    return val['x']

result.sort(key = sortByX)

print(result)

#cv2.waitKey(0)
#cv2.destroyAllWindows()
